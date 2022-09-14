import React, { useState } from 'react'

import {
  Spinner,
  Card,
  Text,
  Heading,
  Stack,
  Inline,
  Autocomplete,
} from '@sanity/ui'

import { useDebounce } from 'use-debounce'
import { Track } from '../types'
import useSearch from '../lib/use-search'
import useManageTrack from '../lib/use-manage-track'
import Result from './result'

interface Props {
  trackDocumentId?: string
}

interface Option {
  value: string
  track: Track
}

const Search: React.FC<Props> = ({ trackDocumentId }) => {
  const { selectedTrack, onSelectTrack, isPending, isSuccess } =
    useManageTrack(trackDocumentId)

  const [searchTerm, setSearchTerm] = useState<string | null>()
  const [debouncedSearchTerm] = useDebounce(searchTerm, 250)
  const { previousResults, results, value, setValue } = useSearch(
    debouncedSearchTerm ?? '',
  )

  return (
    <Stack as='label' space={4}>
      <Stack space={3}>
        <Heading size={1} as='p'>
          Track
        </Heading>
        <Text>Search for a track.</Text>
      </Stack>
      <Autocomplete<Option>
        id='track'
        placeholder='Artist, track, or album'
        options={(results.isValidating && debouncedSearchTerm
          ? previousResults.current
          : results.data
        )?.map(track => ({
          value: track.dataByPlatform.appleMusic.id,
          track,
        }))}
        filterOption={() => true}
        renderOption={({ track }) => <Result track={track} />}
        renderValue={() => selectedTrack?.name ?? ''}
        onQueryChange={setSearchTerm}
        onSelect={value => {
          setValue(value)

          const track = (results.data ?? []).find(
            ({ dataByPlatform }) => dataByPlatform.appleMusic.id === value,
          )

          if (track) {
            onSelectTrack(track)
          }
        }}
        value={value}
        loading={results.isValidating}
      />
      {isPending && (
        <Card padding={4} radius={2} shadow={1} tone='primary'>
          <Inline space={3}>
            <Spinner />
            <Text>Fetching track data&hellip;</Text>
          </Inline>
        </Card>
      )}
      {isSuccess && (
        <Card padding={4} radius={2} shadow={1} tone='positive'>
          <Text>Fetched track data.</Text>
        </Card>
      )}
      {selectedTrack && <Result track={selectedTrack} />}
    </Stack>
  )
}

export default Search
