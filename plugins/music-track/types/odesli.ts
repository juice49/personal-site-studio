export type OdesliPlatform =
  | 'spotify'
  | 'itunes'
  | 'appleMusic'
  | 'youtube'
  | 'youtubeMusic'
  | 'google'
  | 'googleStore'
  | 'pandora'
  | 'deezer'
  | 'tidal'
  | 'amazonStore'
  | 'amazonMusic'
  | 'soundcloud'
  | 'napster'
  | 'yandex'
  | 'spinrilla'

export interface OdesliPlatformData {
  entityUniqueId: string
  url: string
  nativeAppUriMobile?: string
  nativeAppUriDesktop?: string
}

export type OdesliLinksByPlatform = Record<OdesliPlatform, OdesliPlatformData>

export interface OdesliData {
  linksByPlatform: OdesliLinksByPlatform
}
