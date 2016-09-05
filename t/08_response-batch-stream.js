'use strict'
const test         = require('tape')
const through      = require('through2')
const BatchStream  = require('response-batch-stream')
const response     = require('response')
const JsonRpcError = require('error')

test('batch = new response.BatchStream(doJsonStringify)', t => {
    const res1 = response(123, 'foo')
    const err0 = new Error('hoge')
    const err1 = response.error(null, JsonRpcError.ParseError(err0))
    const res2 = response(456, {foo: 'bar'})
    const errs = []
    const spy  = []

    const batch = BatchStream()

    batch
        .on('error', err => errs.push(err))
        .pipe(through.obj((res, _, done) => {
            spy.push(res)
            done()
        }, done => {
            t.is(errs.length, 3, 'batch emit error 3 times')
            t.ok(/not object/.test(errs[0].message), String(errs[0]))
            t.ok(/not write null value/.test(errs[1].message), String(errs[1]))
            t.ok(/"result" is required/.test(errs[2].message), String(errs[2]))
            t.is(spy.length,  1, 'batch push response object once')
            t.is(spy[0].length, 3, 'spy[0].length eq 3')
            t.deepEqual(spy[0][0], {jsonrpc: "2.0", id: 123, result: "foo"}, 'spy[0][0] deepEqual {jsonrpc: "2.0", id: 123, result: "foo"}')
            t.deepEqual(spy[0][1], {jsonrpc: "2.0", id: null, error: {code: -32700, message: "Parse error", data: err0, name: "JsonRpcError"}}, 'spy[0][1] deepEqual {jsonrpc: "2.0", id: null, error: {code: -32700, message: "Parse error", data: [Error: hoge], name: "JsonRpcError"}}')
            done()
            t.end()
        }))

    batch.write(res1)
    batch.write('invalid value')
    batch.write(err1)
    batch.write(null)
    batch.write(res2)
    batch.write({jsonrpc: "2.0", id:999})
    batch.end()
})
