import { ipcMain } from 'electron'
import { Memo } from '@renderer/types'
import { Notebook } from '@renderer/types'

export function dbQueryManager(db) {
  ipcMain.handle('createDb', () => {
    return new Promise<void>((resolve, reject) => {
      db.run(
        'CREATE TABLE IF NOT EXISTS notebook (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, created_at DATETIME, updated_at DATETIME)',
        (err) => {
          if (err) {
            reject(err)
            return
          }

          db.run(
            'CREATE TABLE IF NOT EXISTS memo (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, notebook_id INTEGER, created_at DATETIME, updated_at DATETIME)',
            (err) => {
              if (err) {
                reject(err)
                return
              }
              resolve()
            }
          )
        }
      )
    })
  })

  // SELECT文で全てのメモデータを取得
  ipcMain.handle(
    'selectAllMemo',
    () =>
      new Promise<Memo[]>((resolve, reject) => {
        db.serialize(() => {
          db.all('SELECT * FROM memo', (err, rows: Memo[]) => {
            if (err) reject(err)
            resolve(rows)
          })
        })
      })
  )

  // SELECT文で指定したnotebook_idのメモデータを取得
  ipcMain.handle(
    'selectMemo',
    (_, notebook_id) =>
      new Promise<Memo[]>((resolve, reject) => {
        db.serialize(() => {
          db.all('SELECT * FROM memo WHERE notebook_id = ?', notebook_id, (err, rows: Memo[]) => {
            if (err) reject(err)
            resolve(rows)
          })
        })
      })
  )

  // SELECT文でのノートブックデータを取得
  ipcMain.handle(
    'selectAllNotebook',
    () =>
      new Promise<Notebook[]>((resolve, reject) => {
        db.serialize(() => {
          db.all('SELECT * FROM notebook', (err, rows: Notebook[]) => {
            if (err) reject(err)
            resolve(rows)
          })
        })
      })
  )

  // 最後に挿入したメモを取得
  ipcMain.handle(
    'selectLastMemo',
    () =>
      new Promise<Memo>((resolve, reject) => {
        db.serialize(() => {
          db.get('SELECT * FROM memo ORDER BY id DESC LIMIT 1;', (err, row: Memo) => {
            if (err) reject(err)
            resolve(row)
          })
        })
      })
  )

  // 最後に挿入したノートブックを取得
  ipcMain.handle(
    'selectLastNotebook',
    () =>
      new Promise<Memo>((resolve, reject) => {
        db.serialize(() => {
          db.get('SELECT * FROM notebook ORDER BY id DESC LIMIT 1;', (err, row: Notebook) => {
            if (err) reject(err)
            resolve(row)
          })
        })
      })
  )

  // データ挿入
  ipcMain.handle(
    'insertMemo',
    (_, memoText, notebook_id) =>
      new Promise<void>((resolve, reject) => {
        db.run(
          'INSERT INTO memo (content, notebook_id, created_at, updated_at) VALUES (?, ?, datetime("now", "localtime"), datetime("now", "localtime"));',
          memoText,
          notebook_id,
          (err) => {
            if (err) reject(err)
            resolve()
          }
        )
      })
  )

  ipcMain.handle(
    'insertNotebook',
    (_, notebookName) =>
      new Promise<void>((resolve, reject) => {
        db.run(
          'INSERT INTO notebook (name, created_at, updated_at) VALUES (?, datetime("now", "localtime"), datetime("now", "localtime"));',
          notebookName,
          (err) => {
            if (err) reject(err)
            resolve()
          }
        )
      })
  )
}
