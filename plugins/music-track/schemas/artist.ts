export default {
  title: 'Artist',
  name: 'artist',
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
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
