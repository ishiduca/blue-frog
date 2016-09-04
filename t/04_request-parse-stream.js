'use strict'
const test        = require('tape')
const through     = require('through2')
const ParseStream = require('request-parse-stream')
const request     = require('request')

test('readableStream = new request.ParseStream([requestObject list])', t => {
    const req1 = request(123, '1st', {name: 'foo'})
    const req2 = request.notification('update', {nick: 'bar'})
    const req3 = request(456, '3rd', {name: 'FOO'})
    const spy  = []
    const errs = []

    ParseStream([req1, 'invalid value', req2, null, req3, {method: 'hoge', xmethod: 'boo'}])
        .on('error', err => errs.push(err))
        .pipe(through.obj((req, _, done) => {
            spy.push(req)
            done()
        }, done => {
            t.is(errs.length, 3, 'emit error 3 times')
            t.ok(/not object/.test(errs[0].message), '/not object/.test(errs[0].message)')
            t.ok(/not object/.test(errs[1].message), '/not object/.test(errs[1].message)')
            t.ok(/method name "xmethod" is not allowed/.test(errs[2].message), '/method name "xmethod" is not allowed/.test(errs[2].message)')

            t.is(spy.length, 3, 'push data 3 times')
            t.deepEqual(spy[0], {jsonrpc: "2.0", id: 123, method: "1st", params: {name: "foo"}}, 'spy[0] deepEqual {jsonrpc: "2.0", id: 123, method: "1st", params: {name: "foo"}}')
            t.deepEqual(spy[1], {jsonrpc: "2.0", method: "update", params: {nick: "bar"}}, 'spy[1] deepEqual {jsonrpc: "2.0", method: "update", params: {nick: "bar"}}')
            t.deepEqual(spy[2], {jsonrpc: "2.0", id: 456, method: "3rd", params: {name: "FOO"}}, 'spy[2] deepEqual {jsonrpc: "2.0", id: 456, method: "3rd", params: {name: "FOO"}}')

            done()
            t.end()
        }))
})

const http       = require('http')
const hyperquest = require('hyperquest')
const body       = require('body/json')
const safe       = require('json-stringify-safe')

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
                t.is(errs.length, 2, 'request.parseStream emit error 2 times')
                t.ok(/not object/.test(errs[0].message), String(errs[0]))
                t.ok(/"jsonrpc" must be "2.0"/.test(errs[1].message), String(errs[1]))
                t.is(spy.length, 3, 'request.parseStream push data 3 times')
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

        const arry = safe([req1, "invalid value", req2, {}, req3])

        const hyp = hyperquest.post('http://localhost:3030', {
                'content-type': 'application/json'
              , 'content-length': Buffer.byteLength(arry.length)
            })

        hyp.once('response', response => app.close())

        hyp.end(arry)
    })

    function post (f) {
        return (req, res) => {
            body(req, res, (err, result) => f(err, result, req, res))
        }
    }
})
