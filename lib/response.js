var JSONRPC = require('./jsonrpc').jsonrpc
var valid   = require('./validate')

module.exports = response
module.exports.error = _error

function response (id, result) {
    var a = {
        jsonrpc: JSONRPC
      , id:      id
      , result:  result
    }

    valid.response(a)

    return a
}

function _error (id, err) {
    var e = {
        jsonrpc: JSONRPC
      , id:      id
      , error: err
    }

    valid.error(e)

    return e
}
