<template>
  <div>
    <h1>Vue3 B 子应用 · 首页</h1>
    <p>前缀 <code>/app/vue3-b</code>，由 <code>vite-plugin-qiankun</code> 接入。</p>
    <p class="demo-title">子应用 Vue3 B .demo-title（应为紫色）</p>
    <el-alert title="Element Plus（Vue3）" type="info" :closable="false" show-icon style="margin-top: 16px; max-width: 520px" />
    <el-button type="primary" style="margin-top: 12px" @click="open = true">示例按钮</el-button>
    <el-dialog v-model="open" title="Element Plus" width="400px" :teleported="false">
      <span>与 Vue3 A 相同栈：Element Plus + Vite，弹层保持在微应用容器内。</span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>


<style scoped>
.demo-title {
  color: #7e22ce;
  font-weight: 600;
}
</style>
