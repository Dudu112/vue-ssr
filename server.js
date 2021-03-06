const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const compression = require('compression')
const logger = require('morgan')
const proxy = require('http-proxy-middleware')
const { createBundleRenderer  } = require('vue-server-renderer')
const rootPath = file => path.resolve(__dirname, file)
// const clientConfig = require('./config/webpack.client.config')
const isProd = process.env.NODE_ENV === 'production'
const app = express()

function createRenderer (bundle, template, clientManifest) {
    // console.log(clientManifest)
    // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
    return createBundleRenderer(bundle, {
        template,
        clientManifest,
        cache: require('lru-cache')({
            max: 1000,
            maxAge: 1000 * 60 * 15
        })
    })
}
if (isProd) {
    // In production: create server renderer using server bundle and index HTML
    // template from real fs.
    // The server bundle is generated by vue-ssr-webpack-plugin.
    const bundle = require('./dist/vue-ssr-bundle.json')
    // src/index.template.html is processed by html-webpack-plugin to inject
    // build assets and output as dist/index.html.
    const template = fs.readFileSync(rootPath('./dist/index.html'), 'utf-8')
    // if you need to preload resource or prefetch resource
    // let clientManifestPath = path.join(clientConfig.output.path, 'vue-ssr-client-manifest.json')
    // let clientManifest = fs.readFileSync(clientManifestPath, 'utf-8')
    renderer = createRenderer(bundle, template, undefined)
} else {
    // In development: setup the dev server with watch and hot-reload,
    // and create a new renderer on bundle / index template update.
    require('./config/hotReload')(app, (bundle, template ,clientManifest) => {
        renderer = createRenderer(bundle, template, clientManifest)
    })
}

const serve = (path, cache) => express.static(rootPath(path), {
    maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

app.use(logger('combined'))

app.use(compression())
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))

/**
 * proxy middleware options
 * @type {{target: string, changeOrigin: boolean, pathRewrite: {^/api: string}}}
 */
// if( process.env.NODE_ENV == "development"){
//     let options = {
//         target: '', // target host
//         changeOrigin: true,               // needed for virtual hosted sites
//         pathRewrite: {'^/api' : ''},
//     }
//     let exampleProxy = proxy(options);
//     app.use('/api', exampleProxy);
// }

app.get('*', (req, res) => {
    if (!renderer) {
        return res.end('waiting for compilation... refresh in a moment.')
    }

    const s = Date.now()

    res.setHeader("Content-Type", "text/html")
    // res.setHeader("Server", serverInfo)

    const errorHandler = err => {
        if (err && err.code === 404) {
            res.status(404).end('404 | Page Not Found')
        } else {
            // Render Error Page or Redirect
            res.status(500).end('500 | Internal Server Error')
            console.error(`error during render : ${req.url}`)
            console.error(err)
        }
    }
    var title = ''
    renderer.renderToStream({ title:'', url: req.url })
        .on('error', errorHandler)
        .on('end', () => console.log(`whole request: ${Date.now() - s}ms`))
        .pipe(res)
})

const port = process.env.PORT || 8083
app.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})