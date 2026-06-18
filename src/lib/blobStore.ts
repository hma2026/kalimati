// Minimal IndexedDB key/value store for audio Blobs (child recordings) and,
// later, parent-recorded word audio or uploaded photos. localStorage can't
// hold binary well, so blobs live here. No external dependency.

const DB_NAME = 'kalimati'
const STORE = 'audio'
const VERSION = 1

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode)
        const req = fn(t.objectStore(STORE))
        req.onsuccess = () => resolve(req.result as T)
        req.onerror = () => reject(req.error)
      }),
  )
}

export const blobStore = {
  async set(key: string, blob: Blob) {
    try { await tx('readwrite', (s) => s.put(blob, key)) } catch { /* storage unavailable */ }
  },
  async get(key: string): Promise<Blob | undefined> {
    try { return await tx<Blob | undefined>('readonly', (s) => s.get(key)) } catch { return undefined }
  },
  async delete(key: string) {
    try { await tx('readwrite', (s) => s.delete(key)) } catch { /* ignore */ }
  },
  async clear() {
    try { await tx('readwrite', (s) => s.clear()) } catch { /* ignore */ }
  },
}

/** Stable key for a child's recording of a specific item. */
export const recKey = (childId: string, itemId: string) => `rec:${childId}:${itemId}`
