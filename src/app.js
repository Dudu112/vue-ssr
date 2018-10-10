import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import createRouter from './router'

import { sync } from 'vuex-router-sync'


export function createApp () {
    // 创建 router 实例
    const router = createRouter()
    const store = createStore()
    sync(store, router)
    const app = new Vue({
  // 注入 router 到根 Vue 实例
    store,
    router,
    render: h => h(App)
  })

  // 返回 app 和 router
  return { app, router, store }
}
