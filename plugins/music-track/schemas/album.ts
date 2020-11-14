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
    {
      title: 'Images',
      name: 'images',
      type: 'array',
      of: [
        {
          title: 'Image',
          name: 'image',
          type: 'object',
          fields: [
            {
              title: 'Dimensions',
              name: 'dimensions',
              type: 'array',
              of: [{ type: 'number' }],
            },
            {
              title: 'URL',
              name: 'url',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],
}
