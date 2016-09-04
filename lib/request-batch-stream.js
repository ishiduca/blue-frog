var stream   = require('readable-stream')
var inherits = require('inherits')
var safe     = require('json-stringify-safe')
var validate = require('./validate').request

inherits(RequestBatchStream, stream.Transform)
module.exports = RequestBatchStream

function RequestBatchStream (doJsonStringify) {
    if (!(this instanceof RequestBatchStream))
        return new RequestBatchStream(doJsonStringify)
    stream.Transform.call(this, {objectMode: true})

    this.doJsonStringify = doJsonStringify
    this.requests        = []
}

RequestBatchStream.prototype._transform = function (d, _, done) {
    try {
        validate(d)
    } catch (err) {
        return done(err)
    }
    this.requests.push(d)
    done()
}

RequestBatchStream.prototype._flush = function (done) {
    if (this.requests.length) {
        if (this.requests.length === 1) help(this, this.requests[0])
        else help(this, this.requests)
    }

    this.push(null)
    done()

    function help (me, requests) {
        me.push(me.doJsonStringify ? safe(requests) : requests)
    }
}
