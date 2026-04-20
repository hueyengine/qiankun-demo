<template>
  <div class="shell">
    <header class="top">
      <span class="logo">qiankun demo</span>
      <span class="demo-title">主应用 .demo-title（应为蓝色）</span>
      <el-menu
        mode="horizontal"
        :router="true"
        :default-active="menuActive"
        :key="menuActive"
        class="top-menu"
        background-color="#0f172a"
        text-color="#94a3b8"
        active-text-color="#38bdf8"
      >
        <el-menu-item index="/app/vue2">Vue2 子应用</el-menu-item>
        <el-menu-item index="/app/vue3-a">Vue3 A</el-menu-item>
        <el-menu-item index="/app/vue3-b">Vue3 B</el-menu-item>
      </el-menu>
    </header>
    <div id="subapp-viewport" class="viewport" />
  </div>
</template>

<script>
export default {
  name: 'ShellLayout',
  computed: {
    menuActive() {
      const p = this.$route.path
      if (p.startsWith('/app/vue3-a')) return '/app/vue3-a'
      if (p.startsWith('/app/vue3-b')) return '/app/vue3-b'
      if (p.startsWith('/app/vue2')) return '/app/vue2'
      return p
    },
  },
}
</script>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}
.top {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 16px;
  height: 48px;
  border-bottom: 1px solid #e5e7eb;
  background: #0f172a;
  color: #f8fafc;
}
.logo {
  font-weight: 600;
  flex-shrink: 0;
}
.top-menu {
  flex: 1;
  border-bottom: none !important;
}
.top-menu.el-menu--horizontal > .el-menu-item {
  height: 48px;
  line-height: 48px;
}
.viewport {
  flex: 1;
  min-height: 0;
  background: #f1f5f9;
}
</style>
