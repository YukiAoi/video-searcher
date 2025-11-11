<template>
  <div class="selector" @click="methods.click">
    <el-icon class="selector-icon">
      <UploadFilled />
    </el-icon>
    <div class="selector-text">拖入文件夹或<em>点击来查询视频</em></div>
  </div>
  <el-table :data="tableData" border style="margin: 20px 0" height="calc(100% - 250px)">
    <el-table-column prop="name" label="文件名" min-width="300"></el-table-column>
    <el-table-column prop="path" label="路径" min-width="500"></el-table-column>
    <el-table-column label="类型" min-width="100"
      :formatter="(row: any) => row.isDirectory ? '文件夹' : '文件'"></el-table-column>
    <el-table-column label="大小" min-width="120"
      :formatter="(row: any) => row.isDirectory ? '-' : methods.formatFileSize(row.size)"></el-table-column>
  </el-table>
  <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[100, 200, 300, 400]"
    size="small" background layout="prev, pager, next, sizes,total, jumper" :total="total"
    @size-change="methods.handleSizeChange" @current-change="methods.handleCurrentChange"
    style="display: flex;justify-content: flex-end;" />
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'

interface FileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  birthtime: Date;
  mtime: Date;
}

const tableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return fileList.value.slice(start, end);
})

const fileList = ref<FileInfo[]>([])
const currentPage = ref(1)
const pageSize = ref(100)
const total = ref(0)

const methods = {
  async click() {
    try {
      // 1. 选择文件夹
      const selectResult = await window.myApi.selectFolder()
      if (selectResult.canceled) {
        console.log('用户取消选择')
        return
      }

      // 2. 获取选中的文件夹路径（通常取第一个）
      const folderPath = selectResult.filePaths[0]
      if (!folderPath) return

      // 3. 调用主进程接口读取文件夹内文件
      const readResult = await window.myApi.readFolderFiles(folderPath)
      if (readResult.success && readResult.data) {
        fileList.value = readResult.data
        total.value = readResult.data.length || 0
        currentPage.value = 1
      } else {
        console.error('读取失败:', readResult.error)
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  },
  // 辅助函数：格式化文件大小（字节 -> KB/MB）
  formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  },
  handleSizeChange(size: number) {
    pageSize.value = size
    currentPage.value = 1
  },
  handleCurrentChange(page: number) {
    currentPage.value = page
  }
}
</script>
<style scoped>
.selector {
  height: 103px;
  border: 1px dashed #dcdfe6;
  text-align: center;
  padding: 40px 10px;
  border-radius: 6px;
  user-select: none;
  cursor: pointer;
}

.selector:hover {
  border-color: #409eff;
}

.selector-icon {
  font-size: 67px;
  margin-bottom: 16px;
  color: #a8abb2;
}

.selector-text {
  color: #606266;
  font-size: 14px;
  text-align: center;
}

.selector-text em {
  font-style: normal;
  color: #409eff
}
</style>