var inherits = require('inherits')
var xtend    = require('xtend')

module.exports = JsonRpcError

inherits(JsonRpcError, Error)

function JsonRpcError (code, message, data) {
    if (!(this instanceof JsonRpcError))
        return new JsonRpcError(code, message, data)

    this.name    = this.constructor.name
    this.code    = code
    this.message = message
    if (typeof data !== 'undefined') this.data = data

    ;(Error.captureStackTrace || function (x) {
        x.stack = new Error
    })(this, this.constructor)
}

JsonRpcError.prototype.toJSON = function () {
    var def = {
        code:   this.code
      , message: this.message
    }

    return typeof this.data !== 'undefined'
            ? xtend(def, {data: String(this.data)})
            : xtend(def)
}

var CODES = [-32700, -32600, -32601, -32602, -32603 ]

;[
  'Parse error'
, 'Invalid Request'
, 'Method not found'
, 'Invalid params'
, 'Internal error'
].forEach(function (msg, i) {
    var name = msg.split(' ').map(_upper).join('')
    module.exports[name] = function (data) {
        return new JsonRpcError(CODES[i], msg, data)
    }
})

function _upper (str) {
    return str.slice(0,1).toUpperCase() + str.slice(1)
}
