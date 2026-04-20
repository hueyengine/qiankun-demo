import { registerMicroApps, start } from 'qiankun'

export function setupQiankun() {
  registerMicroApps([
    {
      name: 'sub-vue2',
      entry: '//localhost:8081',
      container: '#subapp-viewport',
      activeRule: (location) => location.pathname.startsWith('/app/vue2'),
    },
    {
      name: 'sub-vue3-a',
      entry: '//localhost:8082',
      container: '#subapp-viewport',
      activeRule: (location) => location.pathname.startsWith('/app/vue3-a'),
    },
    {
      name: 'sub-vue3-b',
      entry: '//localhost:8083',
      container: '#subapp-viewport',
      activeRule: (location) => location.pathname.startsWith('/app/vue3-b'),
    },
  ])

  start({
    sandbox: {
      experimentalStyleIsolation: true,
    },
  })
}
