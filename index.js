var req = module.exports.request  = require('./lib/request')
var res = module.exports.response = require('./lib/response')

module.exports.JsonRpcError = require('./lib/error')

req.ParseStream = require('./lib/request-parse-stream')
req.BatchStream = require('./lib/request-batch-stream')
res.ParseStream = require('./lib/response-parse-stream')
res.BatchStream = require('./lib/response-batch-stream')

