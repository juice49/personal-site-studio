import { format, parseISO } from 'date-fns'

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
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle && format(parseISO(subtitle), 'dd/MM/yyyy'),
      }
    },
  },
  initialValue: () => ({
    date: new Date().toISOString(),
  }),
}
