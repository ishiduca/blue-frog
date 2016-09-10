'use strict'
const path       = require('path')
const http       = require('http')
const ecstatic   = require('ecstatic')(path.join(__dirname, 'static'))
const dispatcher = require('dispatcher')
const api        = require('api')

const frog = dispatcher({prefix: '/'})

frog.method('createAccount', api.createAccount)
frog.method('addNickname',   api.addNickname)
frog.method('getAccount',    api.getAccount)

const app = http.createServer(ecstatic)

frog.install(app)

if (!module.parent) {
    let port = process.env.PORT || 3030
    app.listen(port, () => console.log('server start to listen on port "%s"', app.address().port))
}
