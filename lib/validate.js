var CONSTS         = require('./jsonrpc')
var JSONRPC        = CONSTS.jsonrpc
var ERROR_CODE_MAX = CONSTS.response.error.code.max
var ERROR_CODE_MIN = CONSTS.response.error.code.min

module.exports.request  = validateRequest
module.exports.response = validateResponse
module.exports.error    = validateError

var REQUEST_MEMBERS  = ('jsonrpc id method params').split(' ')
var RESPONSE_MEMBERS = ('jsonrpc id result').split(' ')
var ERROR_MEMBERS    = ('jsonrpc id error').split(' ')

function validateRequest (request) {
    _checkRequestMember(request)
    _validateJsonRpc(request.jsonrpc)
    _validateMethod(request.method)
    if ('id' in request) _validateId(request.id)
    if ('params' in request) _validateParams(request.params)
    return true
}

function validateResponse (response) {
    _checkResponseMember(response)
    _validateJsonRpc(response.jsonrpc)
    _validateId(response.id, 'case response')
    _validateResult(response.result)
    return true
}

function validateError (response) {
    _checkErrorMember(response)
    _validateJsonRpc(response.jsonrpc)
    _validateId(response.id, 'case response.error')
    _validateError(response.error)
    return true
}

function _checkMember (arry, o) {
    if (! isObject(o)) throw new TypeError('not object')
    for (var p in o) {
        if (Object.prototype.hasOwnProperty.apply(o, [p])) {
            if (arry.indexOf(p) === -1)
                throw new Error('this method name "' + p + '" is not allowed')
        }
    }
    return true
}

function _checkRequestMember (o) {
    return _checkMember(REQUEST_MEMBERS, o)
}

function _checkResponseMember (o) {
    return _checkMember(RESPONSE_MEMBERS, o)
}

function _checkErrorMember (o) {
    return _checkMember(ERROR_MEMBERS, o)
}

function _validateJsonRpc (jsonrpc) {
    if (jsonrpc === JSONRPC) return true
    throw new Error('"jsonrpc" must be "' + JSONRPC + '"')
}

function _validateMethod (method) {
   if (isNotEmptyString(method)) return true
   throw new TypeError('"method" must be "string"')
}

function _validateId (id, _responseFlg) {
    if (isINT(id) && id > 0) return true
    if (isNotEmptyString(id)) return true
    if (_responseFlg && id === null) return true
    throw new TypeError('"id" must be "number" or "string". case "response" or "error" then null')
}


function _validateParams (params) {
    if (isObject(params) && Object.keys(params).length) return true
    if (Array.isArray(params) && params.length) return true
    throw new TypeError('"params" must be "array" or "object". and must be not empty')
}

function _validateResult (result) {
    if (typeof result !== 'undefined') return true
    throw new Error('"result" is required')
}

function _validateError (err) {
    if (! err) throw new Error('"error" is required')

    if (! isINT(err.code)) throw new TypeError('"error.code" must be "number"')
    if (err.code > ERROR_CODE_MAX || err.code < ERROR_CODE_MIN)
        throw new RangeError('"error.code" from and including ' + ERROR_CODE_MIN + ' to ' + ERROR_CODE_MAX)
    if (! isNotEmptyString(err.message))
        throw new TypeError('"error.message" must be "string"')
    if (err.data) {
        if (! isNotEmptyString(err.data))
            throw new TypeError('"error.message" must be "string"')
    }

    return true
}

function isINT (n) {
    return typeof n === 'number' && parseInt(n, 10) === n
}

function isObject (o) {
    return Object.prototype.toString.apply(o) === '[object Object]'
}

function isNotEmptyString (str) {
    return typeof str === 'string' && str.trim()
}
