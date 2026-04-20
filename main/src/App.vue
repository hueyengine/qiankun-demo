<template>
  <div id="app-root">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
html,
body,
#app,
#app-root {
  height: 100%;
  margin: 0;
}

.demo-title {
  color: #1d4ed8;
  font-weight: 600;
}
</style>
