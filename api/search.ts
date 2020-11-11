import got from 'got'
import Keyv from 'keyv'
import ms from 'ms'
import { Track, Artist } from '../plugins/music-track/types'

interface AccessTokenResponse {
  access_token: string
  expires_in: number
}

const SPOTIFY_API_URL = 'https://api.spotify.com/v1'
const SPOTIFY_AUTH_API_URL = 'https://accounts.spotify.com/api'
const state = new Keyv<string>()

export default async function (req, res) {
  let accessToken = await getAccessToken()

  const results = await got
    .get([SPOTIFY_API_URL, 'search'].join('/'), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      searchParams: {
        q: req.query.q,
        type: 'track',
      },
    })
    .json<SpotifyApi.TrackSearchResponse>()

  res.json(
    results.tracks.items.map<Track>(track => ({
      spotifyId: track.id,
      isrc: track.external_ids.isrc,
      name: track.name,
      artists: track.artists.map<Artist>(artist => ({
        spotifyId: artist.id,
        name: artist.name,
      })),
      album: {
        spotifyId: track.album.id,
        name: track.album.name,
        images: track.album.images
          .filter(image => image.width && image.height)
          .map(image => ({
            dimensions: [image.width, image.height],
            url: image.url,
          })),
      },
      duration: track.duration_ms,
      explicit: track.explicit,
      spotifyPreviewUrl: track.preview_url,
    })),
  )
}

async function getAccessToken() {
  const accessToken = await state.get('accessToken')

  if (accessToken) {
    return accessToken
  }

  const encodedClientCredentials = Buffer.from(
    [process.env.SPOTIFY_ID, process.env.SPOTIFY_SECRET].join(':'),
  ).toString('base64')

  const auth = await got
    .post([SPOTIFY_AUTH_API_URL, 'token'].join('/'), {
      form: {
        grant_type: 'client_credentials',
      },
      headers: {
        Authorization: `Basic ${encodedClientCredentials}`,
      },
    })
    .json<AccessTokenResponse>()

  await state.set(
    'accessToken',
    auth.access_token,
    ms(auth.expires_in + 's') - ms('5s'),
  )
  return auth.access_token
}
