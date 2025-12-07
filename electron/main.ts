import { app, BrowserWindow, ipcMain, dialog, globalShortcut } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC as string, 'icon-512.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            webSecurity: false // Allow loading local files
        },
        width: 1200,
        height: 800,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#f5f5f7',
            symbolColor: '#1d1d1f',
        },
    })

    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(process.env.DIST as string, 'index.html'))
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg'] }],
    })
    if (canceled) {
        return null
    } else {
        return filePaths[0]
    }
})

ipcMain.on('register-shortcut', (event, { id, shortcut }) => {
    if (!shortcut) return;
    try {
        // Unregister if already exists to avoid conflict (or handle logic better)
        // For MVP, just try register
        const ret = globalShortcut.register(shortcut, () => {
            win?.webContents.send('play-sound', id)
        })
        if (!ret) {
            console.log('Registration failed for', shortcut)
        }
    } catch (error) {
        console.error(error)
    }
})

ipcMain.on('unregister-shortcut', (event, shortcut) => {
    if (shortcut) {
        globalShortcut.unregister(shortcut);
    }
});

app.whenReady().then(createWindow)
