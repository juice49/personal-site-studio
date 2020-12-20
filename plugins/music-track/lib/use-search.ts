import { useRef } from 'react'
import useSwr from 'swr'
import { Results } from '../types/itunes-search'
import { Track } from '../types'

const ITUNES_SEARCH_API_URL = 'https://itunes.apple.com/search'

export default function useSearch(term: string) {
  const previousResults = useRef([])

  const results = useSwr(term.length > 3 ? term : null, async term => {
    const params = new URLSearchParams({
      country: 'GB',
      entity: 'song',
      term,
    })

    const response = await fetch(`${ITUNES_SEARCH_API_URL}?${params}`)
    const data: Results = await response.json()

    const transformedData = data.results.map<Track>(result => ({
      name: result.trackName,
      artists: [
        {
          name: result.artistName,
          dataByPlatform: {
            appleMusic: {
              platform: 'appleMusic',
              id: result.artistId.toString(),
              url: result.artistViewUrl,
            },
          },
        },
      ],
      album: {
        name: result.collectionName,
        appleMusicImageUrl: result.artworkUrl100
          .split('/')
          .slice(0, -2)
          .join('/'),
        dataByPlatform: {
          appleMusic: {
            platform: 'appleMusic',
            id: result.collectionId.toString(),
          },
        },
      },
      duration: result.trackTimeMillis,
      explicit: result.trackExplicitness === 'explicit',
      dataByPlatform: {
        appleMusic: {
          platform: 'appleMusic',
          id: result.trackId.toString(),
          previewUrl: result.previewUrl,
        },
      },
    }))

    previousResults.current = transformedData
    return transformedData
  })

  return {
    previousResults,
    results,
  }
}
