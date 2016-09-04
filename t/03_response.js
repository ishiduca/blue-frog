'use strict'
const test = require('tape')
const mod  = require('response')

test('create json-rpc-response-object', t => {
    const res = mod
    t.ok(res, 'exists response')

    t.throws(() => res(false, 'foo'), /"id" must be "number" or "string"/, 'throw Error # response(false, "foo") # id must be "number" or "string", null')
    t.throws(() => res("  ", 'foo'), /"id" must be "number" or "string"/, 'throw Error # response("  ", "foo") # id must be "number" or "string", null')
    t.throws(() => res(-1, 'foo'), /"id" must be "number" or "string"/, 'throw Error # response(-1, "foo") # id must be "number" or "string", null')
    t.throws(() => res(1.1, 'foo'), /"id" must be "number" or "string"/, 'throw Error # response(1.1, "foo") # id must be "number" or "string", null')
    t.deepEqual(res(null, 'foo'), {jsonrpc: "2.0", id: null, result: "foo"}, 'response(null, "foo") deepEqual {jsonrpc: "2.0", id: null, result: "foo"}')
    t.deepEqual(res(1, 'foo'), {jsonrpc: "2.0", id: 1, result: "foo"}, 'response(1, "foo") deepEqual {jsonrpc: "2.0", id: 1, result: "foo"}')
    t.deepEqual(res("boo", 'foo'), {jsonrpc: "2.0", id: "boo", result: "foo"}, 'response("boo", "foo") deepEqual {jsonrpc: "2.0", id: "boo", result: "foo"}')

    t.throws(() => res(123), /"result" is required/, 'throw Error # response(123) # result not found')
    t.deepEqual(res(1, null), {jsonrpc: "2.0", id: 1, result: null}, 'response(1, null) deepEqual {jsonrpc: "2.0", id: 1, result: null}')

    t.end()
})

test('creae json-rpc-response-error-object', t => {
    const err = mod.error
    t.ok(err, 'exists response.error')

    t.deepEqual(err(123, {code: -32100, message: 'Parse Error'}), {jsonrpc: "2.0", id: 123, error: {code: -32100, message: 'Parse Error'}}, 'response.error(123, {code: -32100, message: "Parse Error"}) deepEqual {id: 123, error: {code: -32100, message: "Parse Error"}}')
    t.deepEqual(err("pack", {code: -32100, message: 'Parse Error'}, "Error stack"), {jsonrpc: "2.0", id: "pack", error: {code: -32100, message: 'Parse Error', data: "Error stack"}}, 'response.error("pack", {code: -32100, message: "Parse Error"}, "Error stack") deepEqual {id: "pack", error: {code: -32100, message: "Parse Error", data: "Error stack"}}')

    var e = new Error('Parse Error'); e.code = -32100
    t.deepEqual(err('foo', e), {jsonrpc: "2.0", id: "foo", error:{code: -32100, message: "Parse Error"}}, 'err("foo", e) deepEqual {jsonrpc: "2.0", id: "foo", error:{code: -32100, message: "Parse Error"}}')

    t.end()
})
