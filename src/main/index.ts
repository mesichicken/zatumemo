import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as sqlite3 from 'sqlite3'
import { Memo } from '@renderer/types'

const db = new sqlite3.Database('./zatumemo_database.db', (err) => {
  if (err) {
    console.error(err.message)
  }
  console.log('Connected to SQLite database')
})

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('createDb', () => {
    new Promise<void>((resolve, reject) => {
      db.run(
        'CREATE TABLE IF NOT EXISTS memo (id INTEGER PRIMARY KEY AUTOINCREMENT, memo TEXT, created_date datetime, updated_date datetime)',
        (err) => {
          if (err) reject(err)
          resolve()
        }
      )
    })
  })

  // SELECT文でのデータ取得
  ipcMain.handle(
    'selectAll',
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

  // データ挿入
  ipcMain.handle(
    'insertData',
    (event, memoText) =>
      new Promise<void>((resolve, reject) => {
        db.run(
          'INSERT INTO memo (memo, created_date, updated_date) VALUES (?, datetime("now", "localtime"), datetime("now", "localtime"));',
          memoText,
          (err) => {
            if (err) reject(err)
            resolve()
          }
        )
      })
  )
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// アプリケーションが終了する前にデータベースを閉じる
app.on('before-quit', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('Close the database connection.')
  })
})
