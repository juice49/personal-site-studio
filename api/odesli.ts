import got from 'got'
import { Platform, PlatformData } from '../plugins/music-track/types'
import { OdesliData } from '../plugins/music-track/types/odesli'

const ODESLI_API_URL = 'https://api.song.link/v1-alpha.1'

export default async function (req, res) {
  const params = new URLSearchParams({
    platform: 'appleMusic',
    id: req.query.id,
    type: 'song',
  })

  const odesliData = await got
    .get(`${ODESLI_API_URL}/links?${params}`)
    .json<OdesliData>()

  res.json(transformPlatformData(odesliData))
}

function transformPlatformData(
  odesliData: OdesliData,
): Partial<Record<Platform, PlatformData>> {
  const platforms: Platform[] = ['appleMusic', 'spotify', 'youtube']

  return platforms.reduce<Partial<Record<Platform, PlatformData>>>(
    (platformData, platform) => {
      const odesliLinksByPlatform = odesliData.linksByPlatform[platform]

      if (!odesliLinksByPlatform) {
        return platformData
      }

      return {
        ...platformData,
        [platform]: {
          platform,
          id: getOdesliPlatformId(odesliLinksByPlatform.entityUniqueId),
          url: odesliLinksByPlatform.url,
        },
      }
    },
    {},
  )
}

function getOdesliPlatformId(odesliEntityUniqueId: string): string {
  return odesliEntityUniqueId.split('::')[1]
}
