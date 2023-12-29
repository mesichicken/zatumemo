import { defineStore } from 'pinia'
import { Memo } from '@renderer/types'

let _database: IDBDatabase

async function getDatabase(): Promise<IDBDatabase> {
  if (_database) {
    return _database
  }

  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open('memoDatabase', 1)

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const target = event.target as IDBRequest
      const database = target.result as IDBDatabase
      database.createObjectStore('memos', { keyPath: 'id' })
    }

    request.onsuccess = (event: Event) => {
      const target = event.target as IDBRequest
      _database = target.result as IDBDatabase
      resolve(_database)
    }

    request.onerror = (event: Event) => {
      console.error('IndexedDB open error', event)
      reject(new Error('IndexedDB open error'))
    }
  })
}

export const useMemosStore = defineStore({
  id: 'memos',
  state: () => ({
    memos: [] as Memo[]
  }),
  getters: {
    getMemos(): Memo[] {
      return this.memos
    }
  },
  actions: {
    async addMemo(memo: string): Promise<void> {
      const database = await getDatabase()
      const transaction = database.transaction('memos', 'readwrite')
      const store = transaction.objectStore('memos')
      const id = this.memos.length ? this.memos[this.memos.length - 1].id + 1 : 1
      const request = store.add({ id, memo, date: new Date() })

      request.onsuccess = () => {
        this.memos.push({ id, memo, date: new Date() })
      }

      request.onerror = (event: Event) => {
        console.error('IndexedDB add error', event)
      }
    },
    async fetchMemos(): Promise<void> {
      const database = await getDatabase()
      const transaction = database.transaction('memos', 'readonly')
      const store = transaction.objectStore('memos')
      const request = store.getAll()

      request.onsuccess = (event: Event) => {
        const target = event.target as IDBRequest
        const memos = target.result as Memo[]
        this.memos = memos
      }

      request.onerror = (event: Event) => {
        console.error('IndexedDB fetch error', event)
      }
    },
    async deleteMemo(id: number): Promise<void> {
      const database = await getDatabase()
      const transaction = database.transaction('memos', 'readwrite')
      const store = transaction.objectStore('memos')
      const request = store.delete(id)

      request.onsuccess = (event: Event) => {
        const target = event.target as IDBRequest
        const id = target.result as number
        this.memos = this.memos.filter((memo) => memo.id !== id)
      }

      request.onerror = (event: Event) => {
        console.error('IndexedDB delete error', event)
      }
    }
  }
})
