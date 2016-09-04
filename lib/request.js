var JSONRPC  = require('./jsonrpc').jsonrpc
var validate = require('./validate').request
var xtend    = require('xtend')

module.exports = request
module.exports.notification = notification

function request (id, method, _params) {
    var def = {
        jsonrpc: JSONRPC
      , method:  method
    }

    var a = id !== false ? xtend(def, {id: id}) : xtend(def)
    var b = typeof _params !== 'undefined'
          ? xtend(a, {params: _params}) : xtend(a)

    validate(b)

    return b
}

function notification (method, _params) {
    return request(false, method, _params)
}
