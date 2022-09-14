import { createPlugin } from 'sanity'
import track from './schemas/track'
import artist from './schemas/artist'
import album from './schemas/album'
import platformData from './schemas/platform-data'
import platformTrackData from './schemas/platform-track-data'

export default createPlugin(() => {
  return {
    name: 'music-track',
    schema: {
      types: [track, artist, album, platformData, platformTrackData],
    },
  }
})
