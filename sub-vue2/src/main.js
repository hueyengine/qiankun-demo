import './public-path'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'

Vue.use(ElementUI)

let instance = null

function render(props = {}) {
  const { container } = props
  const mountEl = container ? container.querySelector('#app') : '#app'
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount(mountEl)
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {}

export async function mount(props) {
  render(props)
}

export async function unmount() {
  if (instance) {
    instance.$destroy()
    if (instance.$el && instance.$el.parentNode) {
      instance.$el.parentNode.removeChild(instance.$el)
    }
    instance = null
  }
}
