'use strict'
const test = require('tape')
const mod  = require('request')

test('create json-rpc-request-object', t => {
    const req = mod
    t.ok(req, 'exists request')
    t.throws(() => req(null, 'foo'), /TypeError.*?"id" must be "number" or "string"/, 'throw TypeError # request(null, "foo") # id must be "number" or "string"')
    t.deepEqual(req(123, 'foo'), {jsonrpc: "2.0", method: "foo", id: 123}, 'request(123, "foo") deepEqual {jsonrpc: "2.0", method: "foo", id: 123}')
    t.deepEqual(req(123, 'foo', [1]), {jsonrpc: "2.0", method: "foo", id: 123, params: [1]}, 'request(123, "foo", [1]) deepEqual {jsonrpc: "2.0", method: "foo", id: 123, params: [1]}')
    t.deepEqual(req(false, 'foo'), {jsonrpc: "2.0", method: "foo"}, 'request(false, "foo") deepEqual {jsonrpc: "2.0", method: "foo"} # json-rpc-request-notification-object')
    t.end()
})

test('create json-rpc-request-notification-object', t => {
    const req = mod.notification
    t.ok(req, 'exists request.notification')
    t.deepEqual(req('foo'), {jsonrpc: "2.0", method: "foo"}, 'request.notifcation("foo") deepEqual {jsonrpc: "2.0", method: "foo"}')
    t.deepEqual(req('foo', {a: 123}), {jsonrpc: "2.0", method: "foo", params: {a: 123}}, 'request.notifcation("foo") deepEqual {jsonrpc: "2.0", method: "foo", params: {a: 123}}')
    t.end()
})
