// src/env.d.ts
/// <reference types="vite/client" />
/// <reference types="electron" /> // 引入 Electron 类型

// 定义 API 调用的返回值类型（根据实际返回结构调整）
interface HandleSendResponse {
  code: number
  data: string // 建议替换为具体类型，如 { id: string; name: string }
  message?: string
}

// 声明全局暴露
declare global {
  interface Window {
    myApi: {
      handleSend: (params: string) => Promise<HandleSendResponse>; // 根据实际参数类型调整 any
      selectFolder: () => Promise<Electron.OpenDialogReturnValue>;
      // 查询文件夹文件的接口类型
      readFolderFiles: (folderPath: string) => Promise<{
        success: boolean;
        data?: Array<{
          name: string;
          path: string;
          isDirectory: boolean;
          size: number;
          birthtime: Date;
          mtime: Date;
        }>;
        error?: string;
      }>;
    };
  }
  interface File {
    path?: string;
  }
}
// 确保该文件被视为模块
export { };