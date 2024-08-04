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
    async prepareNotebooks() {
      try {
        /* @ts-ignore dbOpでエラーを出さない */
        const notebooks = await window.dbOp.selectAllNotebook()
        this.notebooks = notebooks
        this.setCurrentNotebook(notebooks[0])
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('ノートブックの取得に失敗しました')
      }
    },
    async addNotebook(notebookName: string) {
      try {
        /* @ts-ignore dbOpでエラーを出さない */
        await window.dbOp.insertNotebook(notebookName)
        /* @ts-ignore dbOpでエラーを出さない */
        const lastNotebook = await window.dbOp.selectLastNotebook()
        this.notebooks = [...this.notebooks, lastNotebook]
        this.setCurrentNotebook(lastNotebook)
      } catch (error) {
        console.error('Error adding notebook:', error)
        alert('ノートブックの追加に失敗しました')
      }
    },
    async deleteNotebook(notebookId: number) {
      try {
        /* @ts-ignore dbOpでエラーを出さない */
        await window.dbOp.deleteNotebook(notebookId)
        this.notebooks = this.notebooks.filter((notebook) => notebook.id !== notebookId)
        this.setCurrentNotebook(this.notebooks[0])
      } catch (error) {
        console.error('Error deleting notebook:', error)
        alert('ノートブックの削除に失敗しました')
      }
    },
    setCurrentNotebook(notebook: Notebook) {
      this.currentNotebook = notebook
    }
  }
})
