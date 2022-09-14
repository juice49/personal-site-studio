import React from 'react'
import { Box } from '@sanity/ui'
import { DefaultDocumentNodeResolver } from 'sanity/desk'
import Search from './components/search'

// TODO: Use correct types from Sanity.
interface SearchViewProps {
  documentId: string
}

const SearchView: React.FC<SearchViewProps> = props => (
  <Box padding={4}>
    <Search trackDocumentId={props.documentId} />
  </Box>
)

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType },
) => {
  if (schemaType === 'track') {
    return S.document().views([
      S.view.component(SearchView).title('Search'),
      S.view.form(),
    ])
  }

  return S.document().views([S.view.form()])
}
