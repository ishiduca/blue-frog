'use strict'
var events     = require('events')
var inherits   = require('inherits')
var stream     = require('readable-stream')
var hyperquest = require('hyperquest')
var through    = require('through2')
var body       = require('body/json')
var uuid       = require('uuid')
var rpc        = require('blue-frog')

module.exports = BlueFrog
module.exports.GreenFrog = GreenFrog

inherits(BlueFrog, events.EventEmitter)

function BlueFrog (uri) {
    if (!(this instanceof BlueFrog)) return new BlueFrog(uri)

    events.EventEmitter.call(this)

    this.requests = {}
    this.batchStream = new rpc.request.BatchStream('do JSON.stringify')

    var client = hyperquest.post(uri)
    var me = this

    this.batchStream.on('error', onError)
    .pipe(through.obj(function (json, _, done) {
        client.setHeader('content-type', 'application/json')
        client.setHeader('content-length', Buffer.byteLength(json))
        done(null, json)
    }))
    .pipe(client).on('error', onError)
    .once('response', function (res) {
        body(res, null, function (err, response) {
            if (err) return onError(err)
            rpc.response.ParseStream(response).on('error', onError)
            .pipe(through.obj(function (result, _, done) {
                var frog = me.requests[result.id]
                if (frog) {
                    if (result.error) frog.emit('error', result.error)
                    frog.end(result.result)
                }
                done()
            }))
        })
    })

    function onError (err) {
        return me.emit('error', err)
    }
}

BlueFrog.prototype._request = function (id, method, params) {
    return new GreenFrog(id, method, params)
}

BlueFrog.prototype.request = function (method, params) {
    return this._request(uuid.v4(), method, params)
}
BlueFrog.prototype.notification = function (method, params) {
    return this._request(false, method, params)
}
BlueFrog.prototype.batch = function (arry) {
    if (!Array.isArray(arry)) arry = arguments

    for (var i = 0, frog, request; i < arry.length; i++) {
        frog = arry[i]
        request = frog.request
        this.batchStream.write(request)
        if (request.id) this.requests[request.id] = frog
    }
    this.batchStream.end()
}

inherits(GreenFrog, stream.Transform)

function GreenFrog (id, method, params) {
    if (!(this instanceof GreenFrog))
        return new GreenFrog(id, method, params)
    stream.Transform.call(this, {objectMode: true})
    this.request = rpc.request(id, method, params)
}

GreenFrog.prototype._transform = function (res, _, done) {
    done(null, res)
}
