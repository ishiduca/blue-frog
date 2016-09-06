'use strict'
const xtend = require('xtend')

const store = {}

module.exports.createAccount = (params, cont, f) => {
    if (! isObject(params))
        return f(new TypeError('1st arg must be "object" - api.createAccount'))
    if (! isObject(cont))
        return f(new TypeError('2nd arg must be "object" - api.createAccount'))
    if (typeof params.name !== 'string')
        return f(new TypeError('"params.name" must be "string"'))
    if (typeof params.password !== 'string')
        return f(new TypeError('"params.password" must be "string"'))

    var name     = params.name.trim()
    var password = params.password.trim()

    if (! name) return f(new Error('"params.name" is required'))
    if (! password) return f(new Error('"params.password" is required'))

    var id = Date.now().toString()

    f(null, (store[id] = {
        id: id
      , name: name
      , password: password
    }))
}

module.exports.addNickname = (params, cont, f) => {
    if (! isObject(params))
        return f(new TypeError('1st arg must be "object" - api.addNickname'))
    if (! isObject(cont))
        return f(new TypeError('2nd arg must be "object" - api.addNickname'))
    if (! cont.id) return f(new Error('"context.id" not found'))
    if (! store[cont.id]) return f(new Error('account not found in Store. id - "%s"', cont.id))

    var nickname = params.nickname.trim()
    if (! nickname) return f(new Error('"params.nickname" is required'))

    var account = store[cont.id]
    f(null, (store[cont.id] = xtend(account, {nickname: nickname})))
}

function isObject (o) {
    return Object.prototype.toString.apply(o) === '[object Object]'
}
