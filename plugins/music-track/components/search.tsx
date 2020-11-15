import React, { useState, forwardRef, useRef } from 'react'
import PatchEvent, { set } from 'part:@sanity/form-builder/patch-event'
import client from 'part:@sanity/base/client'
import FormField from 'part:@sanity/components/formfields/default'
import SearchableSelect from 'part:@sanity/components/selects/searchable'
import Badge from 'part:@sanity/components/badges/default'
import Label from 'part:@sanity/components/labels/default'
import useSwr from 'swr'
import { useDebounce } from 'use-debounce'
import prettyMs from 'pretty-ms'
import { Track, Album, Platform, PlatformData } from '../types'
import { OdesliData } from '../types/odesli'
import styles from './search.css'

interface Props {
  value?: Track
  onChange: (patch: any) => any
  type: {
    title: string
    description: string
  }
}

const Search = forwardRef((props: Props, ref) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [value] = useDebounce(searchTerm, 250)
  const previousResults = useRef([])

  const results = useSwr(value.length > 3 ? value : null, async q => {
    const response = await fetch(`/api/search?q=${q}`)
    const data = await response.json()
    previousResults.current = data
    return data
  })

  const onChange = async (item: Track) => {
    props.onChange(PatchEvent.from(set(item)))

    const [albumImagePatch, platformDataPatch] = await Promise.all([
      fetchAlbumImage(item.album),
      fetchPlatformUrls(item.spotifyId),
    ])

    props.onChange(albumImagePatch)
    props.onChange(platformDataPatch)
  }

  return (
    <div>
      <FormField label={props.type.title} description={props.type.description}>
        <div className={styles.fieldContainer}>
          <SearchableSelect
            ref={ref}
            placeholder='Search tracks'
            items={
              results.isValidating && value.length !== 0
                ? previousResults.current
                : results.data
            }
            renderItem={track => <Result track={track} />}
            onSearch={setSearchTerm}
            onChange={onChange}
            isLoading={results.isValidating}
          />
          {props.value && <Result track={props.value} />}
        </div>
      </FormField>
    </div>
  )
})

export default Search

interface ResultProps {
  track: Track
}

const Result: React.FC<ResultProps> = ({ track }) => (
  <div className={styles.container}>
    <img
      src={track.album.images[0].url}
      className={styles.image}
      width={track.album.images[0].dimensions[0]}
      height={track.album.images[0].dimensions[1]}
    />
    <div>
      <Label>{track.name}</Label>
      <div className={styles.details}>
        <span className={styles.detailsItem}>
          {track.artists.map(artist => artist.name).join(', ')}
        </span>
        <span className={styles.detailsItem}> - </span>
        <span className={styles.detailsItem}>{track.album.name}</span>
        {track.explicit && (
          <span className={styles.detailsItem}>
            <Badge color='info'>Explicit</Badge>
          </span>
        )}
      </div>
      <p className={styles.duration}>
        {prettyMs(track.duration, { secondsDecimalDigits: 0 })}
      </p>
    </div>
  </div>
)

// TODO: Can we type the returned `PatchEvent`?
async function fetchAlbumImage(album: Album): Promise<any> {
  const response = await fetch(album.images[0].url)
  const data = await response.blob()

  const image = await client.assets.upload(
    'image',
    new File([data], `${album.name}.jpg`),
  )

  return PatchEvent.from(
    set(
      {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: image._id,
        },
      },
      ['album.image'],
    ),
  )
}

const ODESLI_API_URL = 'https://api.song.link/v1-alpha.1'

async function fetchPlatformUrls(spotifyId: string): Promise<any> {
  const params = new URLSearchParams({
    platform: 'spotify',
    id: spotifyId,
    type: 'song',
  })

  const response = await fetch(`${ODESLI_API_URL}/links?${params}`)
  const data: OdesliData = await response.json()

  return PatchEvent.from(
    set(transformPlatformData(data), ['album.dataByPlatform']),
  )
}

function transformPlatformData(
  odesliData: OdesliData,
): Partial<Record<Platform, PlatformData>> {
  const platforms: Platform[] = ['appleMusic', 'spotify', 'youtube']

  return platforms.reduce<Partial<Record<Platform, PlatformData>>>(
    (platformData, platform) => {
      const odesliLinksByPlatform = odesliData.linksByPlatform[platform]

      return {
        ...platformData,
        [platform]: {
          platform,
          id: getOdesliPlatformId(odesliLinksByPlatform.entityUniqueId),
          url: odesliLinksByPlatform.url,
        },
      }
    },
    {},
  )
}

function getOdesliPlatformId(odesliEntityUniqueId: string): string {
  return odesliEntityUniqueId.split('::')[1]
}
