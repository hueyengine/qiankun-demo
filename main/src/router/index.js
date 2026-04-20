import Vue from 'vue'
import VueRouter from 'vue-router'
import ShellLayout from '../layouts/ShellLayout.vue'

Vue.use(VueRouter)

const shell = ShellLayout

const routes = [
  { path: '/', redirect: '/app/vue2' },
  { path: '/app/vue2', name: 'micro-vue2-root', component: shell },
  { path: '/app/vue2/*', name: 'micro-vue2', component: shell },
  { path: '/app/vue3-a', name: 'micro-vue3-a-root', component: shell },
  { path: '/app/vue3-a/*', name: 'micro-vue3-a', component: shell },
  { path: '/app/vue3-b', name: 'micro-vue3-b-root', component: shell },
  { path: '/app/vue3-b/*', name: 'micro-vue3-b', component: shell },
]

export default new VueRouter({
  mode: 'history',
  routes,
})
