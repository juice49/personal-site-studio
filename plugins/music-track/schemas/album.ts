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
      title: 'image',
      name: 'image',
      type: 'reference',
      to: [{ type: 'image' }],
      validation: rule => rule.required().error('Album image not processed.'),
    },
  ],
}
