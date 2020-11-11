import React, { useState, forwardRef, useRef } from 'react'
import PatchEvent, { set } from 'part:@sanity/form-builder/patch-event'
import FormField from 'part:@sanity/components/formfields/default'
import SearchableSelect from 'part:@sanity/components/selects/searchable'
import Badge from 'part:@sanity/components/badges/default'
import Label from 'part:@sanity/components/labels/default'
import useSwr from 'swr'
import { useDebounce } from 'use-debounce'
import prettyMs from 'pretty-ms'
import { Track } from '../types'
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
            onChange={item => props.onChange(PatchEvent.from(set(item)))}
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
        <span className={styles.detailsItem}>•</span>
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
