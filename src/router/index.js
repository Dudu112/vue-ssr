import Router from 'vue-router'
import Vue from 'vue'
// import index from '../pages/index.vue'
// import page from '../pages/page.vue'
// import test from '../pages/test.vue'
Vue.use(Router)

export default function createRouter () {
  return new Router({
    mode: 'history',
    routes: [{
      path: '/',
      // name:'',
      component: () => import('../pages/index.vue')
    }]
  })
}
