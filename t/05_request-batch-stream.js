'use strict'
const test        = require('tape')
const through     = require('through2')
const BatchStream = require('request-batch-stream')
const request     = require('request')

test('transformStream = new request.BatchStream(doJsonStringify)', t => {
    const req1 = request(123, '1st', {name: 'foo'})
    const req2 = request.notification('update', {nick: 'bar'})
    const req3 = request(456, '3rd', {name: 'FOO'})
    const spy  = []
    const errs = []

    const stream = BatchStream()

    stream
        .on('error', err => errs.push(err))
        .pipe(through.obj((req, _, done) => {
            spy.push(req)
            done()
        }, done => {
            t.is(errs.length, 3, 'batchStream emit error 3 times')
            t.ok(/not object/.test(errs[0].message), String(errs[0]))
            t.ok(/not write null value/.test(errs[1].message), String(errs[1]))
            t.ok(/"jsonrpc" must be "2.0"/.test(errs[2].message), String(errs[2]))
            t.is(spy.length, 1, 'batchStream push data once')
            t.is(spy[0].length, 3, 'spy[0].length eq 3')
            t.deepEqual(spy[0][0], {jsonrpc: "2.0", id: 123, method: "1st", params: {name: "foo"}}, 'spy[0][0] deepEqual {jsonrpc: "2.0", id: 123, method: "1st", params: {name: "foo"}}')
            t.deepEqual(spy[0][1], {jsonrpc: "2.0", method: "update", params: {nick: "bar"}}, 'spy[0][1] deepEqual {jsonrpc: "2.0", method: "update", params: {nick: "bar"}}')
            t.deepEqual(spy[0][2], {jsonrpc: "2.0", id: 456, method: "3rd", params: {name: "FOO"}}, 'spy[0][2] deepEqual {jsonrpc: "2.0", id: 456, method: "3rd", params: {name: "FOO"}}')
            done()
            t.end()
        }))
        .on('unpipe', function (src) {
            src.pipe(this)
        })

    stream.write(req1)
    stream.write('invalid value')
    stream.write(req2)
    stream.write(null)
    stream.write(req3)
    stream.write({method: 'hoge'})
    stream.end()
})

const http        = require('http')
const hyperquest  = require('hyperquest')
const body        = require('body/json')
const safe        = require('json-stringify-safe')
const ParseStream = require('request-parse-stream')

test('client -> server', t => {
    const app = http.createServer(post((err, requestObj, req, res) => {
        t.notOk(err, 'json parse error not found')

        const errs = []
        const spy  = []

        ParseStream(requestObj)
            .on('error', err => {
                errs.push(err)
            })
            .pipe(through.obj((req, _, done) => {
                spy.push(req)
                done()
            }, done => {
                t.is(errs.length, 0, 'error not found # json-rpc parse error')
                t.is(spy.length, 3, 'parseStream push data 3 times')
                t.deepEqual(spy[0], {jsonrpc: "2.0", id: 123, method: "1st", params: {name: "foo"}}, 'spy[0] deepEqual {jsonrpc: "2.0", id: 123, method: "1st", params: {name: "foo"}}')
                t.deepEqual(spy[1], {jsonrpc: "2.0", method: "update", params: {nick: "bar"}}, 'spy[1] deepEqual {jsonrpc: "2.0", method: "update", params: {nick: "bar"}}')
                t.deepEqual(spy[2], {jsonrpc: "2.0", id: 456, method: "3rd", params: {name: "FOO"}}, 'spy[2] deepEqual {jsonrpc: "2.0", id: 456, method: "3rd", params: {name: "FOO"}}')
                done(null, "success")
            }))
            .pipe(res)
    }))

    app.once('close', t.end.bind(t))

    app.listen(3030, () => {
        const req1 = request(123, '1st', {name: 'foo'})
        const req2 = request.notification('update', {nick: 'bar'})
        const req3 = request(456, '3rd', {name: 'FOO'})

        const batch = BatchStream(true)
        const hyp   = hyperquest.post('http://localhost:3030')

        const errs = []

        batch.on('error', err => errs.push(err))
            .pipe(through.obj((json, _, done) => {
                hyp.setHeader('content-type', 'application/json')
                hyp.setHeader('content-length', Buffer.byteLength(json))
                done(null, json)
            }))
            .pipe(hyp)

        const arry = safe([req1, "invalid value", req2, {}, req3])

        hyp.once('response', response => {
            t.is(errs.length, 2, 'batchStream emit error 3 times')
            t.ok(/not object/.test(errs[0].message), String(errs[0]))
            t.ok(/"jsonrpc" must be "2.0"/.test(errs[1].message), String(errs[1]))
            app.close()
        })

        batch.write(req1)
        batch.write('invalid value')
        batch.write(req2)
        batch.write({})
        batch.write(req3)
        batch.end()
    })

    function post (f) {
        return (req, res) => {
            body(req, res, (err, result) => f(err, result, req, res))
        }
    }
})
