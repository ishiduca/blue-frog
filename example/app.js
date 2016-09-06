'use strict'
const path     = require('path')
const http     = require('http')
const url      = require('url')
const xtend    = require('xtend')
const body     = require('body/json')
const through  = require('through2')
const ecstatic = require('ecstatic')(path.join(__dirname, 'static'))
const rpc      = require('blue-frog')
const api      = require('api')

const router = new (require('router-line')).Router

router.POST('/', post((err, p, request, req, res) => {
    const batch = rpc.response.BatchStream('do JSON.stringify')

    batch.on('error', err => { // invalid response
        console.log(err)
    })
    .pipe(through.obj((json, _, done) => {
        res.setHeader('content-type', 'application/json')
        res.setHeader('content-length', Buffer.byteLength(json))
        done(null, json)
    }))
    .pipe(res)

    if (err) { // json parse error
        batch.end(rpc.response.error(null
                                   , rpc.JsonRpcError.ParseError(err)))
        return console.log(err)
    }

    const contexts = []

    rpc.request.ParseStream(request).on('error', err => {
        // json-rpc validate error
        console.log(err)
        batch.write(rpc.response.error(null
          , rpc.JsonRpcError.InvalidRequest(err)))
    })
    .pipe(through.obj((req, _, done) => {
        if (!(req.method in api)) {
            return done(null, rpc.response.error(req.id || null
                     , new rpc.JsonRpcError.MethodNotFound('method - "' + req.method + '"')))
        }

        api[req.method](req.params, contexts[contexts.length - 1] || {}, (err, result) => {
            if (err) {
                console.log(err)
                return done(null, rpc.response.error(req.id || null, new rpc.JsonRpcError(-32000, 'Server error', err)))
            }
            else {
                result && contexts.push(result)
                done(null, rpc.response(req.id || null, result))
            }
        })
    }))
    .pipe(batch)
}))

const app = module.exports = http.createServer((req, res) => {
    const opt = url.parse(req.url, true)
    const result = router.route(req.method.toUpperCase(), opt.pathname)
    if (result) result.value(req, res, xtend(opt.query, result.params))
    else ecstatic(req, res)
})

if (!module.parent) {
    let port = process.env.PORT || 3030
    app.listen(port, () => console.log('server start to listen on port %s', app.address().port))
}

function post (f) {
    return (req, res, p) => {
        body(req, res, (err, request) => f(err, p, request, req, res))
    }
}
