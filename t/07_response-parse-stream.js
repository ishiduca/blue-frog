'use strict'
const test         = require('tape')
const through      = require('through2')
const ParseStream  = require('response-parse-stream')
const response     = require('response')
const JsonRpcError = require('error')

test('transformStream = new response.ParseStream([responseObject list])', t => {
    const res1 = response(123, 'success')
    const res2 = {jsonrpc: "2.0", id: null, error: {code: -32700, message: 'Parse error', data: 'can not parse'}}
    const res3 = response(null, {foo: 789})

    const spy  = []
    const errs = []

    ParseStream([res1, 'invalid value', res2, null, res3, {jsonrpc: '2.0', id: null, result: 'poo', xmethod: 'boo'}])
        .on('error', err => errs.push(err))
        .pipe(through.obj((req, _, done) => {
            spy.push(req)
            done()
        }, done => {
            t.is(errs.length, 4, 'emit error 4 times')
            t.ok(/not object/.test(errs[0].message), String(errs[0]))
            t.ok(/Parse error/.test(errs[1].message), String(errs[1]))
            t.ok(/not object/.test(errs[2].message), String(errs[2]))
            t.ok(/this method name "xmethod" is not allowed/.test(errs[3].message), String(errs[3]))

            t.is(spy.length, 2, 'push data 2 times')
            t.deepEqual(spy[0], {jsonrpc: "2.0", id: 123, result: 'success'}, 'spy[0] deepEqual {jsonrpc: "2.0", id: 123, result: "success"}')
            t.deepEqual(spy[1], {jsonrpc: "2.0", id: null, result: {foo: 789}}, 'spy[1] deepEqual {jsonrpc: "2.0", id: null, result: {foo: 789}}')

            done()
            t.end()
        }))
})
