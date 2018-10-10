import { createApp } from './app.js'
const isDev = process.env.NODE_ENV !== 'production'
// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.

export default context => {
  const s = isDev && Date.now()
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    router.push(context.url)
    // 异步组件加载完成后回调
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes
      if (!matchedComponents.length) {
        reject({ code: 404 })
      }

      // 调用匹配组件内的预获取钩子
      Promise.all(matchedComponents.map(component => {
          return component.initData && component.initData({ store, router: router.currentRoute })
        // return component.preFetch && component.preFetch(store)
      })).then(() => {
        isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
        context.state = store.state
        resolve(app)
      }).catch(reject)
    })
  })
}
