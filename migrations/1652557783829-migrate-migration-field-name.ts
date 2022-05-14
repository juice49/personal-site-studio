import { PatchOperations } from '@sanity/types'
import createClient from 'part:@sanity/base/client'

interface Document {
  _id: string
  _rev: string
  migration: number | null
}

const client = createClient.withConfig({
  apiVersion: '2022-05-14',
})

const MIGRATION = 1652557783829

function fetchDocuments(): Promise<Document[]> {
  return client.fetch(
    `
      *[
          _type == "album" && !defined(migration)
        ][0...100] {
        _id,
        _rev,
        _migration
      }
    `,
  )
}

function buildPatch(document: Document): [id: string, patch: PatchOperations] {
  return [
    document._id,
    {
      set: {
        migration: MIGRATION,
      },
      unset: ['_migration'],
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
  const patches = documents.map(buildPatch)

  if (patches.length === 0) {
    console.log('No more documents to migrate.')
    return
  }

  await createTransaction(patches).commit()
  return migrateNextBatch()
}

migrateNextBatch()
