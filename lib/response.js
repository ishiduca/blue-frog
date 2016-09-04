var JSONRPC = require('./jsonrpc').jsonrpc
var valid   = require('./validate')
var xtend   = require('xtend')

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

function _error (id, _err, _data) {
    var e = {
        code: _err.code
      , message: _err.message
    }

    var err = _data ? xtend(e, {data: _data}) : xtend(e)

    var a = {
        jsonrpc: JSONRPC
      , id:      id
      , error: err
    }

    valid.error(a)

    return a
}
