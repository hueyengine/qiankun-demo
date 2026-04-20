import { createRouter, createWebHistory } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import Home from '../views/Home.vue'

const base = qiankunWindow.__POWERED_BY_QIANKUN__ ? '/app/vue3-a/' : '/'

const router = createRouter({
  history: createWebHistory(base),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/page', name: 'page', component: () => import('../views/Page.vue') },
  ],
})

export default router
