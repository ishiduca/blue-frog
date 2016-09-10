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

    const name     = params.name.trim()
    const password = params.password.trim()

    if (! name) return f(new Error('"params.name" is required'))
    if (! password) return f(new Error('"params.password" is required'))

    const id = Date.now().toString()

    store[id] = {
        id: id
      , name: name
      , password: password
    }

    const account = xtend(store[id])
    delete account.password

    f(null, account)
}

module.exports.addNickname = (params, cont, f) => {
    if (! isObject(params))
        return f(new TypeError('1st arg must be "object" - api.addNickname'))
    if (! isObject(cont))
        return f(new TypeError('2nd arg must be "object" - api.addNickname'))
    if (! cont.id) return f(new Error('"context.id" not found'))
    if (! store[cont.id]) return f(new Error('account not found in Store. id - "%s"', cont.id))

    const nickname = params.nickname.trim()
    if (! nickname) return f(new Error('"params.nickname" is required'))

    const account = store[cont.id]
    f(null, (store[cont.id] = xtend(account, {nickname: nickname})))
}

module.exports.getAccount = (params, cont, f) => {
    if (! isObject(cont))
        return f(new TypeError('2nd arg must be "object" - api.getAccount'))
    if (! cont.id) return f(new Error('"context.id" not found'))
    if (! store[cont.id]) return f(new Error('account not found in Store. id - "%s"', cont.id))

    const account = xtend(store[cont.id])
    delete account.password

    f(null, account)
}

function isObject (o) {
    return Object.prototype.toString.apply(o) === '[object Object]'
}
