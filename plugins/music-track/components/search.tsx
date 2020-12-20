import React, { useState } from 'react'
import { Spinner, Card, Text, Inline } from '@sanity/ui'
import FormField from 'part:@sanity/components/formfields/default'
import SearchableSelect from 'part:@sanity/components/selects/searchable'
import { useDebounce } from 'use-debounce'
import useSearch from '../lib/use-search'
import useManageTrack from '../lib/use-manage-track'
import styles from './search.css'
import Result from './result'

interface Props {
  trackDocumentId?: string
}

const Search: React.FC<Props> = ({ trackDocumentId }) => {
  const { selectedTrack, onSelectTrack, isPending, isSuccess } = useManageTrack(
    trackDocumentId,
  )
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 250)
  const { previousResults, results } = useSearch(debouncedSearchTerm)

  return (
    <FormField label='Track' description='Search for a track'>
      <div className={styles.fieldContainer}>
        <SearchableSelect
          placeholder='Artist, track, or album'
          items={
            results.isValidating && debouncedSearchTerm.length !== 0
              ? previousResults.current
              : results.data
          }
          renderItem={track => <Result track={track} />}
          onSearch={setSearchTerm}
          onChange={onSelectTrack}
          isLoading={results.isValidating}
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
      </div>
    </FormField>
  )
}

export default Search
