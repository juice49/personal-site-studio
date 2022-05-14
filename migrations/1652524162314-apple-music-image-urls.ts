import { PatchOperations } from '@sanity/types'
import createClient from 'part:@sanity/base/client'

interface iTunesData {
  artworkUrl100: string
}

interface iTunesResponse<Type> {
  results: Type[]
}

interface Document {
  _id: string
  _rev: string
  _migration: number | null
}

const client = createClient.withConfig({
  apiVersion: '2022-05-14',
})

const MIGRATION = 1652524162314

function fetchDocuments(): Promise<Document[]> {
  return client.fetch(
    `
      *[
          _type == "album" &&
          (
            !defined(_migration) ||
            _migration < $migration
          )
        ][0...100] {
        _id,
        _rev,
        _migration
      }
    `,
    {
      migration: MIGRATION,
    },
  )
}

async function buildPatch(
  document: Document,
): Promise<[id: string, patch: PatchOperations]> {
  const [, iTunesId] = document._id.split('album.')

  const params = new URLSearchParams({
    country: 'GB',
    id: iTunesId,
  })

  const iTunesResponse = await fetch(
    `https://itunes.apple.com/lookup?${params}`,
  )

  const iTunesData: iTunesResponse<iTunesData> = await iTunesResponse.json()

  if (iTunesData.results.length === 0) {
    return [
      document._id,
      {
        set: {
          _migration: MIGRATION,
        },
        unset: ['appleMusicImageUrl'],
        ifRevisionID: document._rev,
      },
    ]
  }

  return [
    document._id,
    {
      set: {
        _migration: MIGRATION,
        appleMusicImageUrl: iTunesData.results[0].artworkUrl100
          .split('/')
          .slice(0, -1)
          .join('/'),
      },
      ifRevisionID: document._rev,
    },
  ]
}

function createTransaction(patches: [id: string, patch: PatchOperations][]) {
  return patches.reduce((transaction, [id, patch]) => {
    return transaction.patch(id, patch)
  }, client.transaction())
}

async function migrateNextBatch() {
  const documents = await fetchDocuments()
  const patches = await Promise.all(documents.map(buildPatch))

  if (patches.length === 0) {
    console.log('No more documents to migrate.')
    return
  }

  await createTransaction(patches).commit()
  return migrateNextBatch()
}

migrateNextBatch()
