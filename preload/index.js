import { contextBridge, ipcRenderer } from 'electron'
const handleSend = async (vue_params) => {
  let fallback = await ipcRenderer.invoke('sent-event', vue_params)
  return fallback
}
// 可以暴露函数和变量
contextBridge.exposeInMainWorld('myApi', {
  handleSend: handleSend,
  selectFolder: () => ipcRenderer.invoke('select-folder'), // 新增文件夹选择接口
  readFolderFiles: (folderPath) => ipcRenderer.invoke('read-folder-files', folderPath),
  getDropFolderPath: async (fullPath) => ipcRenderer.invoke('get-drop-folder-path', fullPath),
})
