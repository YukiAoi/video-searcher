import { createRouter, createWebHistory } from 'vue-router'
// 导入组件
import fileSearch from '@/views/file-search.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/add-search' // 默认跳转文件查询页面
    },
    {
      path: '/add-search',
      name: 'fileSearch',
      component: fileSearch // 注册组件到路由
    }
  ],
})

export default router
