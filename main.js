import { app, BrowserWindow } from 'electron'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  // 下面的url为自己启动vite项目的url。
  win.loadURL('http://localhost:5173/')
  // win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

// 关闭所有窗口时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})