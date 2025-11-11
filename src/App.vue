<template>
  <el-config-provider :locale="locale">
    <el-container>
      <el-aside width="200px">
        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
          default-active="add-search" text-color="#fff" @open="methods.handleOpen" @close="methods.handleClose">
          <el-sub-menu index="add">
            <template #title>
              <el-icon>
                <CirclePlus />
              </el-icon>
              <span>添加视频</span>
            </template>
            <el-menu-item index="add-search">
              <el-icon>
                <Search />
              </el-icon>
              <span>文件查询</span>
            </el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const locale = computed(() => (zhCn))

onMounted(async () => {
  try {
    // 此时 TS 会自动推断 res 为 HandleSendResponse 类型
    const res = await window.myApi.handleSend('liaoruiruirurirui')
    console.log('请求成功：', res) // 可以安全访问接口定义的属性
  } catch (error) {
    // 处理错误（明确错误类型，可选）
    console.error('请求失败：', error instanceof Error ? error.message : error)
  }
})

const methods = {
  handleOpen() { },
  handleClose() { },
}
</script>


<style scoped>
.el-container {
  height: 100%;
}

.el-menu {
  height: 100%;
}
</style>
