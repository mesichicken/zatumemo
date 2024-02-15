import { defineStore } from 'pinia'
import { Notebook } from '../types'

export const useNotebookStore = defineStore('notebook', {
  state: () => ({
    notebooks: [] as Notebook[],
    currentNotebook: null as Notebook | null
  }),
  actions: {
    addNotebook(notebook: Notebook) {
      this.notebooks.push(notebook)
    },
    setNotebooks(notebooks: Notebook[]) {
      this.notebooks = notebooks
    },
    setCurrentNotebook(notebook: Notebook) {
      this.currentNotebook = notebook
    },
    deleteNotebook(notebookId: number) {
      this.notebooks = this.notebooks.filter((notebook) => notebook.id !== notebookId)
    }
  }
})
