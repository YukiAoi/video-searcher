// 声明全局暴露的 myApi 类型
declare global {
  interface Window {
    myApi: {
      handleSend: (params: string) => Promise<string>; // 根据实际参数类型调整 any
    };
  }
}

// 确保该文件被视为模块
export { };