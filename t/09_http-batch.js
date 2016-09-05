'use strict'
var test       = require('tape')
var url        = require('url')
var http       = require('http')
var xtend      = require('xtend')
var through    = require('through2')
var body       = require('body/json')
var hyperquest = require('hyperquest')
var request    = require('request')
var response   = require('response')

request.BatchStream  = require('request-batch-stream')
request.ParseStream  = require('request-parse-stream')
response.BatchStream = require('response-batch-stream')
response.ParseStream = require('response-parse-stream')

var api = {
    accounts: []
  , createAccount (params, done) {
        var id = 'abcdefghijk'
        var account = {id: id, name: params.name}
        this.accounts.push(account)
        setTimeout(() => done(null, account), 500)
    }
  , addNick (params, done) {
        if (! params.id) return setTimeout(() => done(new Error('not found id')), 500)
        var ids   = this.accounts.map((hash) => hash.id)
        var index = ids.indexOf(params.id)
        if (index === -1) return setTimeout(() => done(new Error('auth error')), 500)

        this.accounts[index].nick = params.nick
        var account = this.accounts[index]
        setTimeout(() => done(null, account), 500)
    }
}

test('app test', t => {
    var port = 3030
    var app = http.createServer(post((err, result, _, res) => {
        t.notOk(err, 'no exists json parse error # server')

        var errs  = []
        var p = {}

        request.ParseStream(result).on('error', err => {
            errs.push(err)
            console.log(err)
        })
        .pipe(through.obj((req, _, done) => {
            p = xtend(p, req.params)
            api[req.method](p, (err, result) => {
                if (err) return done(err)
                p = xtend(p, result)
                done(null, response(req.id || null, p))
            })
        }, function (done) {
            t.is(errs.length, 0, 'request.ParseStream no emit error(validate error)')
            done()   
        }))
        .pipe(response.BatchStream(true))
        .pipe(through.obj((json, _, done) => {
            res.setHeader('content-type', 'application/json')
            res.setHeader('content-length', Buffer.byteLength(json))
            done(null, json)
        }))
        .pipe(res)
    }))

    app.once('close', t.end.bind(t))

    app.listen(port, () => {
        var req1 = request(123, 'createAccount', {name: 'ichi-no-suke'})
        var req2 = request.notification('addNick', {nick: 'ichi'})
        var errs = []

        var hyp   = hyperquest.post('http://localhost:' + port)
        var batch = request.BatchStream(true)

        hyp.once('response', res => {
            body(res, null, (err, result) => {
                t.notOk(err, 'no exits json parse error # client')

                var errs = []
                var spy  = []

                response.ParseStream(result)
                    .on('error', err => errs.push(err))
                    .pipe(through.obj((res, _, done) => {
                        spy.push(res)
                        done()
                    }, done => {
                        t.is(errs.length, 0, 'response.ParseStream no emit error(validate errror)')
                        t.is(spy.length, 2, 'response.ParseStream push data 2 times')
                        t.deepEqual(spy[0], {jsonrpc: "2.0", id: 123, result: {id: 'abcdefghijk', name: 'ichi-no-suke'}}, 'spy[0] deepEqual {jsonrpc: "2.0", id: 123, result: {id: "abcdefghijk", name: "ichi-no-suke"}}')
                        t.deepEqual(spy[1], {jsonrpc: "2.0", id: null, result: {id: 'abcdefghijk', name: 'ichi-no-suke', nick: 'ichi'}}, 'spy[1] deepEqual {jsonrpc: "2.0", id: null, result: {id: "abcdefghijk", name: "ichi-no-suke", nick: "ichi"}}')
                        done()
                        app.close()
                    }))
            })
        })

        batch.on('error', err => {
            errs.push(err)
        })
        .pipe(through.obj((json, _, done) => {
            hyp.setHeader('content-type', 'application/json')
            hyp.setHeader('content-length', Buffer.byteLength(json))
            done(null, json)
        }, done => {
            t.is(errs.length, 1, 'request.BatchStream emit error 1 times')
            t.is(errs[0].message, 'this method name "xmethod" is not allowed', String(errs[0]))
        }))
        .pipe(hyp)

        batch.write(req1)
        batch.write({xmethod: 'hoge'})
        batch.end(req2)
    })

    function post (f) {
        return (req, res) => {
            body(req, res, (err, result) => f(err, result, req, res))
        }
    }
})
