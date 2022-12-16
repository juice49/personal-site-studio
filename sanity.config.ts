import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import jam from './schemas/jam'
import musicTrack from './plugins/music-track'
import { defaultDocumentNode } from './plugins/music-track/track-structure'

export default defineConfig({
  name: 'ash',
  projectId: 'pbj0j3k8',
  dataset: 'production',
  plugins: [
    deskTool({
      defaultDocumentNode,
    }),
    visionTool(),
    musicTrack(),
  ],
  schema: {
    types: [jam],
  },
})
