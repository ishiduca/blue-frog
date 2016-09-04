'use strict'
const test = require('tape')
const mod  = require('validate')

test('validate jsonrpc-request-object', t => {
    const validate = mod.request
    t.ok(validate, 'const validate = mod.request')
    t.throws(() => validate(), /TypeError.*?not object/, 'throw TypeError # validate(undefined)')
    t.throws(() => validate(null), /TypeError.*?not object/, 'throw TypeError # validate(null)')
    t.throws(() => validate(false), /TypeError.*?not object/, 'throw TypeError # validate(false)')
    t.throws(() => validate([]), /TypeError.*?not object/, 'throw TypeError # validate([])')
    t.throws(() => validate(/reg/), /TypeError.*?not object/, 'throw TypeError # validate(/reg/)')
    t.throws(() => validate(123), /TypeError.*?not object/, 'throw TypeError # validate(123)')
    t.throws(() => validate("foo"), /TypeError.*?not object/, 'throw TypeError # validate("foo")')

    t.throws(() => validate({_xmethod: 'x method'}), /this method name "_xmethod" is not allowed/, 'throw Error # validate({_method: "not allowed method name"})')
    t.throws(() => validate({jsonrpc: 2.0}), /"jsonrpc" must be "2.0"/, 'throw Error # validate({jsonrpc: 2.0})')
    t.throws(() => validate({jsonrpc: "2.0"}), /"method" must be "string"/, 'throw TypeError # validate({jsonrpc: "2.0"}) # method not found')
    t.throws(() => validate({jsonrpc: "2.0", method: "  "}), /"method" must be "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "  "}) # method msut be not empty string')
    t.throws(() => validate({jsonrpc: "2.0", method: 123}), /"method" must be "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: 123}) # method msut be not empty string')
    t.throws(() => validate({jsonrpc: "2.0", method: null}), /"method" must be "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: null}) # method msut be not empty string')
    t.throws(() => validate({jsonrpc: "2.0", method: false}), /"method" must be "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: false}) # method msut be not empty string')
    t.throws(() => validate({jsonrpc: "2.0", method: {}}), /"method" must be "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: {}}) # method msut be not empty string')
    t.throws(() => validate({jsonrpc: "2.0", method: []}), /"method" must be "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: []}) # method msut be not empty string')
    t.throws(() => validate({jsonrpc: "2.0", method: /reg/}), /"method" must be "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: /reg/}) # method msut be not empty string')

    t.throws(() => validate({jsonrpc: "2.0", method: "foo", id: false}), /"id" must be "number" or "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: false})')
    t.throws(() => validate({jsonrpc: "2.0", method: "foo", id: null}), /"id" must be "number" or "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: null})')
    t.throws(() => validate({jsonrpc: "2.0", method: "foo", id: []}), /"id" must be "number" or "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: []})')
    t.throws(() => validate({jsonrpc: "2.0", method: "foo", id: {}}), /"id" must be "number" or "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: {}})')
    t.throws(() => validate({jsonrpc: "2.0", method: "foo", id: /reg/}), /"id" must be "number" or "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: /reg/})')
    t.throws(() => validate({jsonrpc: "2.0", method: "foo", id: "  "}), /"id" must be "number" or "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: "  "})')
    t.throws(() => validate({jsonrpc: "2.0", method: "foo", id: -1}), /"id" must be "number" or "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: -1})')
    t.throws(() => validate({jsonrpc: "2.0", method: "foo", id: 1.2}), /"id" must be "number" or "string"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: 1.2})')

    t.doesNotThrow(() => validate({jsonrpc: "2.0", method: "foo", id: 123}), null, 'does not throw error # validate({jsonrpc: "2.0", method: "foo", id: 123})')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", method: "foo", id: "string"}), null, 'does not throw error # validate({jsonrpc: "2.0", method: "foo", id: "string"})')

    t.throws(() => validate({jsonrpc: "2.0", method: 'foo', id: 123, params: null}), /"params" must be "array" or "object"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: 123, params: null})')
    t.throws(() => validate({jsonrpc: "2.0", method: 'foo', id: 123, params: false}), /"params" must be "array" or "object"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: 123, params: false})')
    t.throws(() => validate({jsonrpc: "2.0", method: 'foo', id: 123, params: "str"}), /"params" must be "array" or "object"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: 123, params: "str"})')
    t.throws(() => validate({jsonrpc: "2.0", method: 'foo', id: 123, params: 987}), /"params" must be "array" or "object"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: 123, params: 987})')
    t.throws(() => validate({jsonrpc: "2.0", method: 'foo', id: 123, params: /reg/}), /"params" must be "array" or "object"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: 123, params: /reg/})')
    t.throws(() => validate({jsonrpc: "2.0", method: 'foo', id: 123, params: []}), /"params" must be "array" or "object"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: 123, params: []}) # empty array')
    t.throws(() => validate({jsonrpc: "2.0", method: 'foo', id: 123, params: {}}), /"params" must be "array" or "object"/, 'throw TypeError # validate({jsonrpc: "2.0", method: "foo", id: 123, params: {}}) # empty hash')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", method: "foo", id: 123, params: [1]}), null, 'does not throw error # validate({jsonrpc: "2.0", method: "foo", id: 123, params: [1]})')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", method: "foo", id: 123, params: {a: 567}}), null, 'does not throw error # validate({jsonrpc: "2.0", method: "foo", id: 123, params: {a: 567}})')

    t.end()
})

test('validate jsonrpc-response-object', t => {
    const validate = mod.response
    t.ok(validate, 'const validate = mod.response')

    t.throws(() => validate(), /TypeError.*?not object/, 'throw TypeError # validate(undefined)')
    t.throws(() => validate(null), /TypeError.*?not object/, 'throw TypeError # validate(null)')
    t.throws(() => validate(false), /TypeError.*?not object/, 'throw TypeError # validate(false)')
    t.throws(() => validate([]), /TypeError.*?not object/, 'throw TypeError # validate([])')
    t.throws(() => validate(/reg/), /TypeError.*?not object/, 'throw TypeError # validate(/reg/)')
    t.throws(() => validate(123), /TypeError.*?not object/, 'throw TypeError # validate(123)')
    t.throws(() => validate("foo"), /TypeError.*?not object/, 'throw TypeError # validate("foo")')

    t.throws(() => validate({_xmethod: 'x method'}), /this method name "_xmethod" is not allowed/, 'throw Error # validate({_method: "not allowed method name"})')
    t.throws(() => validate({jsonrpc: 2.0, id: null, result: null}), /"jsonrpc" must be "2.0"/, 'throw Error # validate({jsonrpc: 2.0})')

    t.throws(() => validate({jsonrpc: "2.0", id: false, result: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", result: null, id: false})')
    t.throws(() => validate({jsonrpc: "2.0", id: "   ", result: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", result: null, id: "   "})')
    t.throws(() => validate({jsonrpc: "2.0", id: [], result: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", result: null, id: []})')
    t.throws(() => validate({jsonrpc: "2.0", id: {}, result: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", result: null, id: {}})')
    t.throws(() => validate({jsonrpc: "2.0", id: /reg/, result: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", result: null, id: /reg/})')
    t.throws(() => validate({jsonrpc: "2.0", id: 1.3, result: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", result: null, id: 1.3})')
    t.throws(() => validate({jsonrpc: "2.0", id: -2, result: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", result: null, id: -2})')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", id: 1, result: null}), null, 'does not throw error validate({jsonrpc: "2.0", result: null, id: 1})')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", id: "a", result: null}), null, 'does not throw error validate({jsonrpc: "2.0", result: null, id: "a"})')

    t.throws(() => validate({jsonrpc: "2.0", id: null}), /"result" is required/, 'throw Error # validate({jsonrpc: "2.0", id: null}) # result is required')
    t.throws(() => validate({jsonrpc: "2.0", id: null, result: void(0)}), /"result" is required/, 'throw Error # validate({jsonrpc: "2.0", id: null, result: void(0)}) # result is required')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", id: null, result: null}), null,'does not throw Error # validate({jsonrpc: "2.0", id: null, result: null})')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", id: null, result: false}), null,'does not throw Error # validate({jsonrpc: "2.0", id: null, result: false})')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", id: null, result: {}}), null,'does not throw Error # validate({jsonrpc: "2.0", id: null, result: {}})')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", id: null, result: []}), null,'does not throw Error # validate({jsonrpc: "2.0", id: null, result: []})')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", id: null, result: -1.2}), null,'does not throw Error # validate({jsonrpc: "2.0", id: null, result: -1.2})')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", id: null, result: "bar"}), null,'does not throw Error # validate({jsonrpc: "2.0", id: null, result: "bar"})')

    t.end()
})

test('validate jsonrpc-response-error-object', t => {
    const validate = mod.error
    t.ok(validate, 'const validate = mod.error')

    t.throws(() => validate(), /TypeError.*?not object/, 'throw TypeError # validate(undefined)')
    t.throws(() => validate(null), /TypeError.*?not object/, 'throw TypeError # validate(null)')
    t.throws(() => validate(false), /TypeError.*?not object/, 'throw TypeError # validate(false)')
    t.throws(() => validate([]), /TypeError.*?not object/, 'throw TypeError # validate([])')
    t.throws(() => validate(/reg/), /TypeError.*?not object/, 'throw TypeError # validate(/reg/)')
    t.throws(() => validate(123), /TypeError.*?not object/, 'throw TypeError # validate(123)')
    t.throws(() => validate("foo"), /TypeError.*?not object/, 'throw TypeError # validate("foo")')

    t.throws(() => validate({_xmethod: 'x method'}), /this method name "_xmethod" is not allowed/, 'throw Error # validate({_method: "not allowed method name"})')
    t.throws(() => validate({jsonrpc: 2.0, id: null, error: null}), /"jsonrpc" must be "2.0"/, 'throw Error # validate({jsonrpc: 2.0})')

    t.throws(() => validate({jsonrpc: "2.0", id: false, error: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", error: null, id: false})')
    t.throws(() => validate({jsonrpc: "2.0", id: "   ", error: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", error: null, id: "   "})')
    t.throws(() => validate({jsonrpc: "2.0", id: [], error: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", error: null, id: []})')
    t.throws(() => validate({jsonrpc: "2.0", id: {}, error: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", error: null, id: {}})')
    t.throws(() => validate({jsonrpc: "2.0", id: /reg/, error: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", error: null, id: /reg/})')
    t.throws(() => validate({jsonrpc: "2.0", id: 1.3, error: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", error: null, id: 1.3})')
    t.throws(() => validate({jsonrpc: "2.0", id: -2, error: null}), /"id" must be "number" or "string"/, 'throw Error # validate({jsonrpc: "2.0", error: null, id: -2})')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", id: 1, error: {code: -32600, message: 'foo'}}), null, 'does not throw Error # validate({jsonrpc: "2.0", id: 1, error: {code: -32600, message: "foo"}})')
    t.doesNotThrow(() => validate({jsonrpc: "2.0", id: 1, error: {code: -32600, message: 'foo', data: 'ers'}}), null, 'does not throw Error # validate({jsonrpc: "2.0", id: 1, error: {code: -32600, message: "foo", data: "ers"}})')

    t.throws(() => validate({jsonrpc: "2.0", id: null}), /"error" is required/, 'throw Error # validate({jsonrpc: "2.0", id: null})')
    t.throws(() => validate({jsonrpc: "2.0", id: null, error: null}), /"error" is required/, 'throw Error # validate({jsonrpc: "2.0", id: null, error: null})')
    t.throws(() => validate({jsonrpc: "2.0", id: null, error: false}), /"error" is required/, 'throw Error # validate({jsonrpc: "2.0", id: null, error: false})')
    t.throws(() => validate({jsonrpc: "2.0", id: null, error: "error"}), /"error.code" must be "number"/, 'throw Error # validate({jsonrpc: "2.0", id: null, error: "error"})')
    t.throws(() => validate({jsonrpc: "2.0", id: null, error: -32601}), /"error.code" must be "number"/, 'throw Error # validate({jsonrpc: "2.0", id: null, error: -32601})')
    t.throws(() => validate({jsonrpc: "2.0", id: null, error: /reg/}), /"error.code" must be "number"/, 'throw Error # validate({jsonrpc: "2.0", id: null, error: /reg/})')
    t.throws(() => validate({jsonrpc: "2.0", id: null, error: new Error("Test Error")}), /"error.code" must be "number"/, 'throw Error # validate({jsonrpc: "2.0", id: null, error: new Error("Test Error")})')
    t.throws(() => validate({jsonrpc: "2.0", id: null, error: {message: "error msg"}}), /"error.code" must be "number"/, 'throw Error # validate({jsonrpc: "2.0", id: null, error: {message: "error msg"}})')
    t.throws(() => validate({jsonrpc: "2.0", id: null, error: {code: -31999, message: "error msg"}}), /RangeError.*?"error.code" from and including -32768 to -32000/, 'throw RangeError # validate({jsonrpc: "2.0", id: null, error: {code: -31999, message: "error msg"}})')
    t.throws(() => validate({jsonrpc: "2.0", id: null, error: {code: -32769, message: "error msg"}}), /RangeError.*?"error.code" from and including -32768 to -32000/, 'throw RangeError # validate({jsonrpc: "2.0", id: null, error: {code: -32769, message: "error msg"}})')
    t.throws(() => validate({jsonrpc: "2.0", id: null, error: {code: -32000, message: "   "}}), /TypeError.*?"error.message" must be "string"/, 'throw TypeError # validate({jsonrpc: "2.0", id: null, error: {code: -32000, message: "   "}})')
    t.throws(() => validate({jsonrpc: "2.0", id: null, error: {code: -32000, message: 123}}), /TypeError.*?"error.message" must be "string"/, 'throw TypeError # validate({jsonrpc: "2.0", id: null, error: {code: -32000, message: 123}})')

    t.end()
})
