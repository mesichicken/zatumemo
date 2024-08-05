import { defineStore } from 'pinia'
import { Memo } from '../types'

type State = {
  memos: Memo[]
}

export const useMemoStore = defineStore('memo', {
  state: (): State => ({
    memos: []
  }),
  actions: {
    async prepareMemos(currentNotebookId: number) {
      try {
        console.log('currentNotebookId:', currentNotebookId)
        /* @ts-ignore dbOpでエラーを出さない */
        this.memos = await window.dbOp.selectMemo(currentNotebookId)
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('メモの取得に失敗しました')
      }
    },
    async addMemo(memo_content: string, current_notebook_id: number) {
      try {
        /* @ts-ignore dbOpでエラーを出さない */
        await window.dbOp.insertMemo(memo_content, current_notebook_id)
        /* @ts-ignore dbOpでエラーを出さない */
        const lastMemo = await window.dbOp.selectLastMemo()
        this.memos = [...this.memos, lastMemo]
      } catch (error) {
        console.error('Error adding memo:', error)
        alert('メモの追加に失敗しました')
      }
    },
    async deleteMemo(memoId: number) {
      try {
        /* @ts-ignore dbOpでエラーを出さない */
        await window.dbOp.deleteMemo(memoId)
        this.memos = this.memos.filter((memo) => memo.id !== memoId)
      } catch (error) {
        console.error('Error deleting memo:', error)
        alert('メモの削除に失敗しました')
      }
    }
  }
})
