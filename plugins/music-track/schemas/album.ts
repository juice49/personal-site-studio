export default {
  title: 'Album',
  name: 'album',
  type: 'object',
  fields: [
    {
      title: 'Spotify id',
      name: 'spotifyId',
      type: 'string',
    },
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'image',
      name: 'image',
      type: 'image',
      validation: rule => rule.required().error('Album image not processed.'),
    },
  ],
}
