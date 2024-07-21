import { defineStore } from 'pinia'
import { Notebook } from '../types'

type State = {
  notebooks: Notebook[]
  currentNotebook: Notebook | null
}

export const useNotebookStore = defineStore('notebook', {
  state: (): State => ({
    notebooks: [],
    currentNotebook: null
  }),
  actions: {
    addNotebook(notebook: Notebook) {
      this.notebooks = [...this.notebooks, notebook]
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
