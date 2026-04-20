import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const base = window.__POWERED_BY_QIANKUN__ ? '/app/vue2/' : '/'

export default new VueRouter({
  mode: 'history',
  base,
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/about', name: 'about', component: () => import('../views/About.vue') },
  ],
})
