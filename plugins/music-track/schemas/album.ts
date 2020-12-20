export default {
  title: 'Album',
  name: 'album',
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'Image',
      name: 'image',
      type: 'image',
    },
    {
      title: 'Apple Music image URL',
      name: 'appleMusicImageUrl',
      type: 'string',
      description:
        'The base Apple Music image URL, excluding "/source" and the filename.',
    },
    {
      title: 'Data by platform',
      name: 'dataByPlatform',
      type: 'object',
      fields: [
        {
          title: 'Apple Music',
          name: 'appleMusic',
          type: 'platformData',
        },
      ],
    },
  ],
}
