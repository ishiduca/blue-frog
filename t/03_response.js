'use strict'
const test         = require('tape')
const mod          = require('response')
const JsonRpcError = require('error')

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

    t.test('var err = response.error(id, {code: number, message: string, data: string_or_errorObj}) # string', tt => {
        const hugaError = {code: -32610, message: 'Huga error', data: 'not found Huga'}
        const error = err(123, hugaError)
        tt.deepEqual(error, {jsonrpc: "2.0", id: 123, error: {code: -32610, message: 'Huga error', data: 'not found Huga'}}, 'error deepEqual {jsonrpc: "2.0", id: 123, error: {code: -32610, message: "Huga error", data: "not found Huga"}}')
        const json = JSON.stringify(error)
        console.log('# JSON.stringify(error)')
        tt.ok(/"jsonrpc"\s*:\s*"2\.0"/.test(json), '/"jsonrpc"\s*:\s"2\\.0"/.test(json))')
        tt.ok(/"id"\s*:\s*123/.test(json), '/"id"\s*:\s123/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32610[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32610[^}]*?}/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Huga error"[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Huga error"[^}]*?}/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"data"\s*:\s*"not found Huga"[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"data"\s*:\s*"not found Huga"[^}]*?}/.test(json))')
        console.log('# %s', json)
        tt.end()
    })

    t.test('var err = response.error(id, new JsonRpcError(string))', tt => {
        const hugaError = new JsonRpcError(-32610, 'Huga error', 'Not Found Huga')
        const error = err(123, hugaError)
        tt.deepEqual(error, {jsonrpc: "2.0", id: 123, error: hugaError}, 'error deepEqual {jsonrpc: "2.0", id: 123, error: hugaError}')
        const json = JSON.stringify(error)
        console.log('# JSON.stringify(error)')
        tt.ok(/"jsonrpc"\s*:\s*"2\.0"/.test(json), '/"jsonrpc"\s*:\s"2\\.0"/.test(json))')
        tt.ok(/"id"\s*:\s*123/.test(json), '/"id"\s*:\s123/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32610[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32610[^}]*?}/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Huga error"[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Huga error"[^}]*?}/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"data"\s*:\s*"Not Found Huga"[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"data"\s*:\s*"Not Found Huga"[^}]*?}/.test(json))')
        console.log('# %s', json)
        tt.end()
    })

    t.test('var err = response.error(id, new JsonRpcError(errorObj))', tt => {
        const hugaError = new JsonRpcError(-32610, 'Huga error', new Error('not found huga huga'))
        const error = err(123, hugaError)
        tt.deepEqual(error, {jsonrpc: "2.0", id: 123, error: hugaError}, 'error deepEqual {jsonrpc: "2.0", id: 123, error: hugaError}')
        const json = JSON.stringify(error)
        console.log('# JSON.stringify(error)')
        tt.ok(/"jsonrpc"\s*:\s*"2\.0"/.test(json), '/"jsonrpc"\s*:\s"2\\.0"/.test(json))')
        tt.ok(/"id"\s*:\s*123/.test(json), '/"id"\s*:\s123/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32610[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32610[^}]*?}/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Huga error"[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Huga error"[^}]*?}/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"data"\s*:\s*"\[?Error:\s*not found huga huga\]?"[^}]*?}/.test(json), '/"error"\\s*:\\s*{[^}]*?"data"\\s*:\\s*"\\[?Error:\\s*not found huga huga\\]?"[^}]*?}/.test(json))')
        console.log('# %s', json)
        tt.end()
    })

    t.end()
})
