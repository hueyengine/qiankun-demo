<template>
  <div>
    <h1>Vue2 子应用 · 首页</h1>
    <p>运行在 qiankun 中时，基座地址前缀为 <code>/app/vue2</code>。</p>
    <p class="demo-title">子应用 Vue2 .demo-title（应为红色）</p>
    <el-alert
      title="Element UI（Vue2）"
      type="success"
      :closable="false"
      show-icon
      style="margin-top: 16px; max-width: 520px"
    />
    <el-button type="primary" style="margin-top: 12px" @click="visible = true">示例按钮</el-button>
    <el-dialog title="Element UI" :visible.sync="visible" width="400px" :append-to-body="false">
      <span>子应用内独立引入 element-ui，并将弹层限制在子应用容器内。</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SubVue2Home',
  data() {
    return {
      visible: false,
    }
  },
}
</script>


<style scoped>
.demo-title {
  color: #dc2626;
  font-weight: 600;
}
</style>
