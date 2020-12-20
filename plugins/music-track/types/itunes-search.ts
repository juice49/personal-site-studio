export interface Result {
  wrapperType: 'track' | 'collection' | 'artist'
  kind:
    | 'book'
    | 'album'
    | 'coached-audio'
    | 'feature-movie'
    | 'interactive-booklet'
    | 'music-video'
    | 'pdf'
    | 'podcast'
    | 'podcast-episode'
    | 'software-package'
    | 'song'
    | 'tv-episode'
    | 'artist'
  trackId: string
  trackName: string
  trackExplicitness: 'explicit' | 'cleaned' | 'notExplicit'
  trackTimeMillis: number
  previewUrl: string
  artistId: string
  artistName: string
  artistViewUrl: string
  artworkUrl30: string
  artworkUrl60: string
  artworkUrl100: string
  collectionId: string
  collectionName: string
  censoredName: string
}

export interface Results {
  resultCount: number
  results: Result[]
}
