import { useState, useRef } from 'react'
import { merge } from 'lodash'
import { useDocumentOperation } from '@sanity/react-hooks'
import client from 'part:@sanity/base/client'

import {
  Track,
  Artist,
  Album,
  DataByPlatform,
  PlatformTrackData,
} from '../types'

import getAppleMusicImageUrl from '../lib/get-apple-music-image-url'

export default function useManageTrack(
  trackDocumentId?: string,
): {
  selectedTrack: Track | null
  onSelectTrack: (track: Track) => Promise<void>
  isPending: boolean
  isSuccess: boolean | null
} {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
  const id = useRef<string | undefined>(trackDocumentId)

  // TODO: Type?
  const documentOperations: any = useDocumentOperation(trackDocumentId, 'track')
  const { patch } = documentOperations

  async function onSelectTrack(track: Track) {
    setSelectedTrack(track)
    setIsPending(true)
    setIsSuccess(null)

    const [artists, album, dataByPlatform] = await Promise.all([
      Promise.all(track.artists.map(createArtist)),
      (async () => {
        const albumImage = await createAlbumImage(track.album)
        return createAlbum(track.album, albumImage._id)
      })(),
      fetchPlatformUrls(track.dataByPlatform.appleMusic.id),
      (async () => {
        id.current = await maybeCreateTrack({ name: track.name }, id.current)
      })(),
    ])

    await patch.execute([
      {
        set: {
          ...track,
          album: {
            _type: 'reference',
            _ref: album._id,
          },
          artists: artists.map(artist => ({
            _type: 'reference',
            _ref: artist._id,
            _key: artist._id,
          })),
          dataByPlatform: merge(dataByPlatform, track.dataByPlatform),
        },
      },
    ])

    setIsPending(false)
    setIsSuccess(true)
  }

  return { selectedTrack, onSelectTrack, isPending, isSuccess }
}

async function fetchPlatformUrls(
  appleMusicId: string,
): Promise<DataByPlatform<PlatformTrackData>> {
  const params = new URLSearchParams({ id: appleMusicId })
  const response = await fetch(`/api/odesli/?${params}`)
  return response.json()
}

async function maybeCreateTrack(
  track: Partial<Track>,
  trackDocumentId?: string,
): Promise<string> {
  if (trackDocumentId) {
    return trackDocumentId
  }

  const createdTrack = await createTrack(track)
  return createdTrack._id
}

// TODO: Return type.
function createTrack(track: Partial<Track>): Promise<any> {
  return client.create({
    _type: 'track',
    ...track,
  })
}

// TODO: Return type.
function createArtist(artist: Artist): Promise<any> {
  return client.createIfNotExists({
    _id: `artist.${artist.dataByPlatform.appleMusic.id}`,
    _type: 'artist',
    ...artist,
  })
}

// TODO: Return type.
function createAlbum(album: Album, albumImageId: string): Promise<any> {
  return client.createIfNotExists({
    _id: `album.${album.dataByPlatform.appleMusic.id}`,
    _type: 'album',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: albumImageId,
      },
    },
    ...album,
  })
}

// TODO: Return type.
async function createAlbumImage(album: Album): Promise<any> {
  const response = await fetch(
    getAppleMusicImageUrl(album.appleMusicImageUrl, 1400),
  )

  const data = await response.blob()
  return client.assets.upload('image', new File([data], `${album.name}.jpg`))
}
