export interface SpotifyObject {
  spotifyId: string
  name: string
}

export interface Artist extends SpotifyObject {}

export interface Album extends SpotifyObject {
  images: AlbumImage[]
}

export interface AlbumImage {
  dimensions: [width: number, height: number]
  url: string
}

export type Platform = 'spotify' | 'appleMusic' | 'youtube'

export interface PlatformData {
  platform: Platform
  id: string
  url: string
}

export interface Track extends SpotifyObject {
  isrc: string
  artists: Artist[]
  album: Album
  duration: number
  explicit: boolean
  spotifyPreviewUrl?: string
  dataByPlatform?: Record<Platform, PlatformData>
}
