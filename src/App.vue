<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// 1. 定义 API 调用的返回值类型（根据实际返回结构调整）
interface HandleSendResponse {
  code: number
  data: string // 建议替换为具体类型，如 { id: string; name: string }
  message?: string
}

// 2. 扩展 Window 接口，声明 myApi 的类型（避免 TS 报错 "Property 'myApi' does not exist on type 'Window'"）
declare global {
  interface Window {
    myApi: {
      handleSend: (param: string) => Promise<HandleSendResponse>
    }
  }
}

onMounted(async () => {
  try {
    // 此时 TS 会自动推断 res 为 HandleSendResponse 类型
    const res = await window.myApi.handleSend('liaoruiruirurirui')
    console.log('请求成功：', res.code, res.data) // 可以安全访问接口定义的属性
  } catch (error) {
    // 处理错误（明确错误类型，可选）
    console.error('请求失败：', error instanceof Error ? error.message : error)
  }
})
</script>


<style scoped></style>
