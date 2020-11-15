import Search from '../components/search'

export default {
  title: 'Track',
  name: 'track',
  type: 'object',
  fields: [
    {
      title: 'Spotify id',
      name: 'spotifyId',
      type: 'string',
    },
    {
      title: 'ISRC',
      name: 'isrc',
      type: 'string',
    },
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'Artists',
      name: 'artists',
      type: 'array',
      of: [
        {
          type: 'artist',
        },
      ],
    },
    {
      title: 'Album',
      name: 'album',
      type: 'album',
    },
    {
      title: 'Explicit',
      name: 'explicit',
      type: 'boolean',
    },
    {
      title: 'Duration',
      name: 'duration',
      type: 'number',
    },
    {
      title: 'Spotify preview URL',
      name: 'spotifyPreviewUrl',
      type: 'string',
    },
    {
      title: 'Data by platform',
      name: 'dataByPlatform',
      type: 'object',
      fields: [
        {
          title: 'Spotify',
          name: 'spotify',
          type: 'platformData',
        },
        {
          title: 'Apple Music',
          name: 'appleMusic',
          type: 'platformData',
        },
        {
          title: 'YouTube',
          name: 'youtube',
          type: 'platformData',
        },
      ],
    },
  ],
  inputComponent: Search,
}
