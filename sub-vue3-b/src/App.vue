<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="sub-root">
    <aside class="side">
      <div class="side-title">Vue3 B（Vite）</div>
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/page">子页</RouterLink>
    </aside>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.sub-root {
  display: flex;
  height: 100%;
  min-height: 100%;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}
.side {
  width: 200px;
  padding: 16px;
  background: #4c1d95;
  color: #ede9fe;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.side-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.side a {
  color: #ddd6fe;
  text-decoration: none;
}
.side a.router-link-active {
  color: #fff;
  font-weight: 600;
}
.content {
  flex: 1;
  padding: 16px;
  background: #fff;
}
</style>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>
