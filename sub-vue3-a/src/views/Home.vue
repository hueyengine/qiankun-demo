<template>
  <div>
    <h1>Vue3 A 子应用 · 首页</h1>
    <p>前缀 <code>/app/vue3-a</code>，由 <code>vite-plugin-qiankun</code> 接入。</p>
    <el-alert
      title="Element Plus（Vue3）"
      type="success"
      :closable="false"
      show-icon
      style="margin-top: 16px; max-width: 520px"
    />
    <el-button type="primary" style="margin-top: 12px" @click="open = true">示例按钮</el-button>
    <el-dialog v-model="open" title="Element Plus" width="400px">
      <span>Vue3 子应用请用 Element Plus，不要用 element-ui。</span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>
