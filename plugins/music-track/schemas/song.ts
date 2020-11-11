import Search from '../components/search'

export default {
  title: 'Song',
  name: 'song',
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
      title: 'Spotify preview URL',
      name: 'spotifyPreviewUrl',
      type: 'string',
    },
  ],
  inputComponent: Search,
}
