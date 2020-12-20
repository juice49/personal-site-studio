import React from 'react'
import S from '@sanity/desk-tool/structure-builder'
import { Box } from '@sanity/ui'
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

export const getDefaultDocumentNode = ({ schemaType }) => {
  if (schemaType === 'track') {
    return S.document().views([
      S.view.component(SearchView).title('Search'),
      S.view.form(),
    ])
  }

  return S.document().views([S.view.form()])
}

export default S.defaults()
