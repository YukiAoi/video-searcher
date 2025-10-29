import { app, ipcMain, BrowserWindow } from 'electron'
import path from "node:path";
import { fileURLToPath } from 'url'

// 手动定义 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload/index.js')
    }
  })

  // 下面的url为自己启动vite项目的url。
  win.loadURL('http://localhost:5173/')
  // win.loadFile('index.html')
}

ipcMain.handle('sent-event', (event, params) => {
  console.log(params)
  return '1111'
})

app.whenReady().then(() => {
  createWindow()
})

// 关闭所有窗口时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})