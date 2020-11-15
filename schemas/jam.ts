import { format, parseISO } from 'date-fns'

export default {
  title: 'Jam',
  name: 'jam',
  type: 'document',
  description: 'This is my jam',
  fields: [
    {
      title: 'Track',
      name: 'track',
      type: 'track',
    },
    {
      title: 'Date',
      name: 'date',
      type: 'datetime',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    },
  ],
  orderings: [
    {
      title: 'Date',
      name: 'date',
      by: [
        {
          field: 'date',
          direction: 'desc',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'track.name',
      subtitle: 'date',
      media: 'track.album.image',
      artistName: 'track.artists.0.name',
    },
    prepare({ title, subtitle, artistName, ...rest }) {
      return {
        title: artistName && title ? [artistName, title].join(' - ') : null,
        subtitle: subtitle && format(parseISO(subtitle), 'dd/MM/yyyy'),
        ...rest,
      }
    },
  },
  initialValue: () => ({
    date: new Date().toISOString(),
  }),
}
