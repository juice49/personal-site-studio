export type Platform = 'appleMusic' | 'spotify' | 'youtube'

export interface PlatformData {
  platform: Platform
  id: string
  url?: string
}

export type DataByPlatform<T extends PlatformData> = Partial<
  Record<Exclude<Platform, 'appleMusic'>, T>
> & { appleMusic: T }

export interface Artist {
  name: string
  dataByPlatform: DataByPlatform<PlatformData>
}

export interface Album {
  name: string
  appleMusicImageUrl: string
  dataByPlatform: DataByPlatform<PlatformData>
}

export interface PlatformTrackData extends PlatformData {
  previewUrl?: string
}

export interface Track {
  name: string
  artists: Artist[]
  album: Album
  duration: number
  explicit: boolean
  dataByPlatform: DataByPlatform<PlatformTrackData>
}
