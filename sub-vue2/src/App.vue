<template>
  <div class="sub-root">
    <aside class="side">
      <div class="side-title">Vue2 子应用</div>
      <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'SubVue2App',
}
</script>

<style>
.sub-root {
  display: flex;
  height: 100%;
  min-height: 100%;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}
.side {
  width: 200px;
  padding: 16px;
  background: #1e293b;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.side-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.side a {
  color: #94a3b8;
  text-decoration: none;
}
.side a.router-link-active {
  color: #38bdf8;
}
.content {
  flex: 1;
  padding: 16px;
  background: #fff;
}
</style>
