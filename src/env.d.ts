// 1. 定义 API 调用的返回值类型（根据实际返回结构调整）
interface HandleSendResponse {
  code: number
  data: string // 建议替换为具体类型，如 { id: string; name: string }
  message?: string
}

// 声明全局暴露的 myApi 类型
declare global {
  interface Window {
    myApi: {
      handleSend: (params: string) => Promise<HandleSendResponse>; // 根据实际参数类型调整 any
    };
  }
}

// 确保该文件被视为模块
export { };