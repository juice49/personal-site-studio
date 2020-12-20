export default {
  title: 'Track',
  name: 'track',
  type: 'document',
  fields: [
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
          type: 'reference',
          to: [{ type: 'artist' }],
        },
      ],
    },
    {
      title: 'Album',
      name: 'album',
      type: 'reference',
      to: [{ type: 'album' }],
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
      title: 'Data by platform',
      name: 'dataByPlatform',
      type: 'object',
      fields: [
        {
          title: 'Apple Music',
          name: 'appleMusic',
          type: 'platformTrackData',
        },
        {
          title: 'Spotify',
          name: 'spotify',
          type: 'platformTrackData',
        },
        {
          title: 'YouTube',
          name: 'youtube',
          type: 'platformTrackData',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'artists.0.name',
      media: 'album.image',
    },
  },
}
