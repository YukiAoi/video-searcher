consol.log('reload loaded')
import { contextBridge, ipcRenderer } from 'electron'
const handleSend = async (vue_params) => {
  let fallback = await ipcRenderer.invoke('sent-event', vue_params)
  return fallback
}
contextBridge.exposeInMainWorld('myApi', {
  handleSend: handleSend
  // 可以暴露函数和变量
})
