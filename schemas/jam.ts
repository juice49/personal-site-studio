import { format } from 'date-fns'

export default {
  title: 'Jam',
  name: 'jam',
  type: 'document',
  description: 'This is my jam',
  fields: [
    {
      title: 'Song',
      name: 'song',
      type: 'song',
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
  preview: {
    select: {
      title: 'song.name',
      subtitle: 'date',
    },
    perpare({ title, subtitle }) {
      return {
        title,
        subtitle: format(subtitle, 'DD/MM/YYYY'),
      }
    },
  },
  initialValue: () => ({
    date: new Date().toISOString(),
  }),
}
