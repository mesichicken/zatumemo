import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('dbOp', {
      createDb: async () => ipcRenderer.invoke('createDb'), // データベース作成
      selectAllMemo: async () => ipcRenderer.invoke('selectAllMemo'), // メモ全件取得
      selectMemo: async (notebook_id) => ipcRenderer.invoke('selectMemo', notebook_id), // ノートブックIDを指定してメモを取得
      selectAllNotebook: async () => ipcRenderer.invoke('selectAllNotebook'), // ノートブック全件取得
      selectLastMemo: async () => ipcRenderer.invoke('selectLastMemo'), // 最後に挿入したメモを取得
      selectLastNotebook: async () => ipcRenderer.invoke('selectLastNotebook'), // 最後に挿入したノートブックを取得
      insertMemo: async (memoText, notebook_id) =>
        ipcRenderer.invoke('insertMemo', memoText, notebook_id), // データベースにMemoを追加
      insertNotebook: async (notebookName) => ipcRenderer.invoke('insertNotebook', notebookName), // データベースにNotebookを追加
      deleteMemo: async (id) => ipcRenderer.invoke('deleteMemo', id) // データベースからMemoを削除
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
