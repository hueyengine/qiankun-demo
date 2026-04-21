import { hijackStyles, releaseStyles } from './style-hijack'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

let app = null

function render(props = {}) {
  const { container } = props
  const el = container ? container.querySelector('#app') : document.getElementById('app')
  if (!el) return
  if (container) hijackStyles(container)
  app = createApp(App)
  app.use(router)
  app.use(ElementPlus)
  app.mount(el)
}

renderWithQiankun({
  bootstrap() {
    return Promise.resolve()
  },
  mount(props) {
    render(props)
  },
  unmount(props) {
    releaseStyles()
    if (app) {
      app.unmount()
      app = null
    }
    const { container } = props || {}
    if (container) {
      const el = container.querySelector('#app')
      if (el) el.innerHTML = ''
    }
  },
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}
