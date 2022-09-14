import { useState, useRef } from 'react'
import { merge } from 'lodash'
import { useClient, useDocumentOperation } from 'sanity'
import { SanityClient } from '@sanity/client'

import {
  Track,
  Artist,
  Album,
  DataByPlatform,
  PlatformTrackData,
} from '../types'

import getAppleMusicImageUrl from '../lib/get-apple-music-image-url'

export default function useManageTrack(trackDocumentId?: string): {
  selectedTrack: Track | null
  onSelectTrack: (track: Track) => Promise<void>
  isPending: boolean
  isSuccess: boolean | null
} {
  const client = useClient({
    apiVersion: '2022-09-14',
  })

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
      Promise.all(track.artists.map(artist => createArtist(client, artist))),
      (async () => {
        const albumImage = await createAlbumImage(client, track.album)
        return createAlbum(client, track.album, albumImage._id)
      })(),
      fetchPlatformUrls(track.dataByPlatform.appleMusic.id),
      (async () => {
        id.current = await maybeCreateTrack(
          client,
          { name: track.name },
          id.current,
        )
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
  client: SanityClient,
  track: Partial<Track>,
  trackDocumentId?: string,
): Promise<string> {
  if (trackDocumentId) {
    return trackDocumentId
  }

  const createdTrack = await createTrack(client, track)
  return createdTrack._id
}

// TODO: Return type.
function createTrack(
  client: SanityClient,
  track: Partial<Track>,
): Promise<any> {
  return client.create({
    _type: 'track',
    ...track,
  })
}

// TODO: Return type.
function createArtist(client: SanityClient, artist: Artist): Promise<any> {
  return client.createIfNotExists({
    _id: `artist.${artist.dataByPlatform.appleMusic.id}`,
    _type: 'artist',
    ...artist,
  })
}

// TODO: Return type.
function createAlbum(
  client: SanityClient,
  album: Album,
  albumImageId: string,
): Promise<any> {
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
async function createAlbumImage(
  client: SanityClient,
  album: Album,
): Promise<any> {
  const response = await fetch(
    getAppleMusicImageUrl(album.appleMusicImageUrl, 1400),
  )

  const data = await response.blob()
  return client.assets.upload('image', new File([data], `${album.name}.jpg`))
}
