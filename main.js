import { app, ipcMain, BrowserWindow, dialog } from 'electron'
import fs from 'fs/promises' // 异步文件操作（推荐）
import path from "node:path";
import { fileURLToPath } from 'url'

// 手动定义 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置文件路径（存储到应用数据目录）
const configPath = path.join(app.getPath('userData'), 'config.json');
let lastSelectedFolder = null; // 内存中的上次路径

// 读取本地配置文件（启动时执行）
const loadConfig = async () => {
  try {
    // 检查配置文件是否存在
    await fs.access(configPath);
    // 读取文件内容
    const data = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(data);
    // 恢复上次路径（如果存在）
    if (config.lastSelectedFolder) {
      lastSelectedFolder = config.lastSelectedFolder;
      console.log('get last path from config:', lastSelectedFolder);
    }
  } catch (error) {
    // 配置文件不存在或读取失败（首次启动时正常）
    console.log('no config,use default value:', error);
  }
};

// 保存路径到本地配置文件（关闭窗口或路径更新时执行）
const saveConfig = async () => {
  try {
    // 确保应用数据目录存在（不存在则创建）
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    // 写入配置（只保存需要的字段）
    await fs.writeFile(
      configPath,
      JSON.stringify({ lastSelectedFolder }, null, 2), // 格式化JSON，方便查看
      'utf8'
    );
    console.log('save path to config:', lastSelectedFolder);
  } catch (error) {
    console.error('save config fail:', error);
  }
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload/index.js'),
      contextIsolation: true, // 必须开启（默认开启），否则 contextBridge 无效
      nodeIntegration: false, // 必须关闭，否则安全风险且可能冲突
      sandbox: false  // 关闭沙箱模式，允许 ES 模块语法在 preload 中执行
    }
  })
  win.maximize() // 最大化窗口
  // 下面的url为自己启动vite项目的url。
  win.loadURL('http://localhost:5173/')
  // win.loadFile('index.html')

  // 打开electron的开发者工具
  win.webContents.openDevTools({ mode: 'detach' })

  // 窗口关闭时保存配置
  win.on('close', async () => {
    await saveConfig(); // 关闭前保存路径
  });
}

ipcMain.handle('sent-event', (event, params) => {
  console.log(params)
  return params
})

// 处理文件夹选择请求
ipcMain.handle('select-folder', async () => {
  // 计算默认路径：如果有上次选择的路径，取其上一级；否则用桌面路径
  let defaultPath;
  if (lastSelectedFolder) {
    // path.dirname() 可以获取路径的上一级目录
    defaultPath = path.dirname(lastSelectedFolder);
  } else {
    // 初始默认路径：桌面
    defaultPath = app.getPath('desktop');
  }
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'], // 只允许选择文件夹
    defaultPath
  })
  if (!result.canceled && result.filePaths.length > 0) {
    lastSelectedFolder = result.filePaths[0];
  }
  return result;
})

// 处理文件夹内文件查询
ipcMain.handle('read-folder-files', async (_, folderPath) => {
  const readFolderRecursive = async (currentPath) => {
    // 读取文件夹内所有条目（文件/子文件夹）
    const entries = await fs.readdir(currentPath, { withFileTypes: true })
    // 常见视频格式
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv']

    // 遍历所有条目，获取详细信息
    const fileList = []
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name)
      // 获取文件状态（大小、创建时间等）
      const stat = await fs.stat(fullPath)

      // 如果是文件，且后缀名在视频格式列表中，才加入列表
      if (!entry.isDirectory()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (videoExtensions.includes(ext)) { // 只保留视频文件
          fileList.push({
            name: entry.name,
            path: fullPath,
            isDirectory: entry.isDirectory(),
            size: stat.size,
            birthtime: stat.birthtime,
            mtime: stat.mtime
          })
        }
      } else {
        // 递归调用，获取子文件夹内的文件列表
        const subFolderFiles = await readFolderRecursive(fullPath)
        // 将子文件夹的文件合并到当前列表
        fileList.push(...subFolderFiles)
      }
    }
    return fileList; // 关键修复：返回收集到的文件列表
  }
  try {
    // 从根文件夹开始递归读取
    const allFiles = await readFolderRecursive(folderPath)
    return {
      success: true,
      data: allFiles
    }
  } catch (error) {
    console.error('read file fail:', error)
    return {
      success: false,
      error: error.message
    }
  }
})

app.whenReady().then(async () => {
  try {
    await loadConfig(); // 启动时读取上次保存的路径
    console.log('read config success,last path:', lastSelectedFolder);
  } catch (error) {
    console.error('read config fail:', error);
  }
  createWindow()
})

// 关闭所有窗口时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})