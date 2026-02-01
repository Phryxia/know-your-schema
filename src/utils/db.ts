import type { SchemaFile } from '../types'

const DB_NAME = 'know-your-schema'
const DB_VERSION = 1
const STORE_NAME = 'schemas'

function generateUUID(): string {
  return crypto.randomUUID()
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject): void => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (): void => {
      reject(request.error)
    }

    request.onsuccess = (): void => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event): void => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

export async function saveSchema(fileName: string, content: string): Promise<string> {
  const db = await openDB()
  const id = generateUUID()
  const schema: SchemaFile = {
    id,
    fileName,
    content,
    uploadedAt: Date.now(),
  }

  return new Promise((resolve, reject): void => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.add(schema)

    request.onsuccess = (): void => {
      resolve(id)
    }

    request.onerror = (): void => {
      reject(request.error)
    }
  })
}

export async function getAllSchemas(): Promise<SchemaFile[]> {
  const db = await openDB()

  return new Promise((resolve, reject): void => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = (): void => {
      resolve(request.result || [])
    }

    request.onerror = (): void => {
      reject(request.error)
    }
  })
}

export async function getSchemaById(id: string): Promise<SchemaFile | null> {
  const db = await openDB()

  return new Promise((resolve, reject): void => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(id)

    request.onsuccess = (): void => {
      resolve(request.result || null)
    }

    request.onerror = (): void => {
      reject(request.error)
    }
  })
}

export async function deleteSchema(id: string): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject): void => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onsuccess = (): void => {
      resolve()
    }

    request.onerror = (): void => {
      reject(request.error)
    }
  })
}
