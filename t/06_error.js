'use strict'
const test = require('tape')
const JsonRpcError = require('error')

test('const err = JsonRpcError(code, message[, _data])', t => {
    t.test('new JsonRpcError(code, message)', tt => {
        const err = new JsonRpcError(-32721, 'Foo Error')
        tt.ok(err, 'ok new JsonRpcError(-32721, "Foo Error")')
        tt.is(err.name, 'JsonRpcError', 'err.name eq "JsonRpcError"')
        tt.is(err.message, 'Foo Error', 'err.message eq "Foo Error"')
        tt.is(err.code, -32721, 'err.code eq -32721')

        console.log('# JSON.stringify(err)')
        const json = JSON.stringify(err)
        tt.ok(/^{.*?"code"\s*:\s*-32721.*?}$/.test(json), 'ok /^{.*?"code"\s*:\s*-32721.*?}$/.test(json)')
        tt.ok(/^{.*?"message"\s*:\s*"Foo Error".*?}$/.test(json), 'ok /^{.*?"message"\s*:\s*"Foo Error".*?}$/.test(json)')
        tt.notOk(/^{.*?"name".*?}$/.test(json), 'notOk /^{.*?"name".*?}$/.test(json)')
        tt.notOk(/^{.*?"data".*?}$/.test(json), 'notOk /^{.*?"data".*?}$/.test(json)')
        console.log('# %s', json)
        tt.end()
    })

    t.test('new JsonRpcError(code, message, stringData)', tt => {
        const err = new JsonRpcError(-32721, 'Foo Error', "textdata")
        tt.ok(err, 'ok new JsonRpcError(-32721, "Foo Error")')
        tt.is(err.name, 'JsonRpcError', 'err.name eq "JsonRpcError"')
        tt.is(err.message, 'Foo Error', 'err.message eq "Foo Error"')
        tt.is(err.code, -32721, 'err.code eq -32721')
        tt.is(err.data, "textdata", 'err.data eq "textdata"')

        console.log('# JSON.stringify(err)')
        const json = JSON.stringify(err)
        tt.ok(/^{.*?"code"\s*:\s*-32721.*?}$/.test(json), 'ok /^{.*?"code"\s*:\s*-32721.*?}$/.test(json)')
        tt.ok(/^{.*?"message"\s*:\s*"Foo Error".*?}$/.test(json), 'ok /^{.*?"message"\s*:\s*"Foo Error".*?}$/.test(json)')
        tt.ok(/^{.*?"data"\s*:\s*"textdata".*?}$/.test(json), 'ok /^{.*?"data"\s*:\s*"textdata".*?}$/.test(json)')
        console.log('# %s', json)
        tt.end()
    })

    t.test('new JsonRpcError(code, message, errorObj)', tt => {
        const e   = new Error('hoge')
        const err = new JsonRpcError(-32721, 'Foo Error', e)
        tt.ok(err, 'ok new JsonRpcError(-32721, "Foo Error")')
        tt.is(err.name, 'JsonRpcError', 'err.name eq "JsonRpcError"')
        tt.is(err.message, 'Foo Error', 'err.message eq "Foo Error"')
        tt.is(err.code, -32721, 'err.code eq -32721')
        tt.is(err.data, e, 'err.data eq errorObj')

        console.log('# JSON.stringify(err)')
        const json = JSON.stringify(err)
        tt.ok(/^{.*?"code"\s*:\s*-32721.*?}$/.test(json), 'ok /^{.*?"code"\s*:\s*-32721.*?}$/.test(json)')
        tt.ok(/^{.*?"message"\s*:\s*"Foo Error".*?}$/.test(json), 'ok /^{.*?"message"\s*:\s*"Foo Error".*?}$/.test(json)')
        tt.ok(/^{.*?"data"\s*:\s*"\[?Error:\s*hoge\]?".*?}$/.test(json), 'ok /^{.*?"data"\s*:\s*"\[?Error:\s*hoge\]?".*?}$/.test(json)')
        console.log('# %s', json)
        tt.end()
    })

    t.end()
})

test('defined JsonRpcError', t => {
    t.ok(JsonRpcError.ParseError, 'exists JsonRpcError.ParseError')
    t.ok(JsonRpcError.InvalidRequest, 'exists JsonRpcError.InvalidRequest')
    t.ok(JsonRpcError.MethodNotFound, 'exists JsonRpcError.MethodNotFound')
    t.ok(JsonRpcError.InvalidParams, 'exists JsonRpcError.InvalidParams')
    t.ok(JsonRpcError.InternalError, 'exists JsonRpcError.InternalError')

    t.test('err = JsonRpcError.ParseError(addMessage_or_errorObj)', tt => {
        const err = JsonRpcError.ParseError('can not parse "{abc}"')
        tt.is(err.name, 'JsonRpcError', 'err.name eq "JsonRpcError"')
        tt.is(err.code, -32700, 'err.code eq -32700')
        tt.is(err.message, 'Parse error', 'err.message eq "Parse error"')
        tt.is(err.data, 'can not parse "{abc}"', "err.data eq 'can not parse \"{abc}\"'")

        console.log('# JSON.stringify(err)')
        const json = JSON.stringify(err)
        tt.ok(/^{.*"message"\s*:\s*"Parse error".*}$/.test(json), 'ok /^{.*"message"\s*:\s*"Parse error".*}$/.test(json)')
        tt.ok(/^{.*"code"\s*:\s*-32700.*}$/.test(json), 'ok /^{.*"code"\s*:\s*-32700.*}$/.test(json)')
        tt.ok(/^{.*"data"\s*:\s*"can not parse \\"{abc}\\"".*}$/.test(json), 'ok /^{.*"data"\s*:\s*"can not parse \\"{abc}\\"".*}$/.test(json)')
        console.log('# %s', json)
        tt.end()
    })

    t.test('err = JsonRpcError.InvalidRequest(addMessage_or_errorObj)', tt => {
        const err = JsonRpcError.InvalidRequest('json rpc 2.0 error')
        tt.is(err.name, 'JsonRpcError', 'err.name eq "JsonRpcError"')
        tt.is(err.code, -32600, 'err.code eq -32600')
        tt.is(err.message, 'Invalid Request', 'err.message eq "Invalid Request"')
        tt.is(err.data, 'json rpc 2.0 error', "err.data eq 'json rpc 2.0 error'")

        console.log('# JSON.stringify(err)')
        const json = JSON.stringify(err)
        tt.ok(/^{.*"message"\s*:\s*"Invalid Request".*}$/.test(json), 'ok /^{.*"message"\s*:\s*"Invalid Request".*}$/.test(json)')
        tt.ok(/^{.*"code"\s*:\s*-32600.*}$/.test(json), 'ok /^{.*"code"\s*:\s*-32600.*}$/.test(json)')
        tt.ok(/^{.*"data"\s*:\s*"json rpc 2\.0 error".*}$/.test(json), 'ok /^{.*"data"\s*:\s*"json rpc 2\\.0 error".*}$/.test(json)')
        console.log('# %s', json)
        tt.end()
    })

    t.test('err = JsonRpcError.MethodNotFound(addMessage_or_errorObj)', tt => {
        const e   = new Error('hoge')
        const err = JsonRpcError.MethodNotFound(e)
        tt.is(err.name, 'JsonRpcError', 'err.name eq "JsonRpcError"')
        tt.is(err.code, -32601, 'err.code eq -32601')
        tt.is(err.message, 'Method not found', 'err.message eq "Method not found"')
        tt.is(err.data, e, 'err.data eq new Error("hoge")')

        console.log('# JSON.stringify(err)')
        const json = JSON.stringify(err)
        tt.ok(/^{.*"message"\s*:\s*"Method not found".*}$/.test(json), 'ok /^{.*"message"\s*:\s*"Method not found".*}$/.test(json)')
        tt.ok(/^{.*"code"\s*:\s*-32601.*}$/.test(json), 'ok /^{.*"code"\s*:\s*-32601.*}$/.test(json)')
        tt.ok(/^{.*"data"\s*:\s*"\[?Error:\s?hoge\]?".*}$/.test(json), 'ok /^{.*"data"\s*:\s*"\\[?Error:\\s?hoge\\]?".*}$/.test(json)')
        console.log('# %s', json)
        tt.end()
    })

    t.test('err = JsonRpcError.InvalidParams(addMessage_or_errorObj)', tt => {
        const e   = new Error('hoge')
        const err = JsonRpcError.InvalidParams(e)
        tt.is(err.name, 'JsonRpcError', 'err.name eq "JsonRpcError"')
        tt.is(err.code, -32602, 'err.code eq -32602')
        tt.is(err.message, 'Invalid params', 'err.message eq "Invalid params"')
        tt.is(err.data, e, 'err.data eq new Error("hoge")')

        console.log('# JSON.stringify(err)')
        const json = JSON.stringify(err)
        tt.ok(/^{.*"message"\s*:\s*"Invalid params".*}$/.test(json), 'ok /^{.*"message"\s*:\s*"Invalid params".*}$/.test(json)')
        tt.ok(/^{.*"code"\s*:\s*-32602.*}$/.test(json), 'ok /^{.*"code"\s*:\s*-32602.*}$/.test(json)')
        tt.ok(/^{.*"data"\s*:\s*"\[?Error:\s?hoge\]?".*}$/.test(json), 'ok /^{.*"data"\s*:\s*"\\[?Error:\\s?hoge\\]?".*}$/.test(json)')
        console.log('# %s', json)
        tt.end()
    })

    t.test('err = JsonRpcError.InternalError(addMessage_or_errorObj)', tt => {
        const e   = new Error('hoge')
        const err = JsonRpcError.InternalError(e)
        tt.is(err.name, 'JsonRpcError', 'err.name eq "JsonRpcError"')
        tt.is(err.code, -32603, 'err.code eq -32603')
        tt.is(err.message, 'Internal error', 'err.message eq "Internal error"')
        tt.is(err.data, e, 'err.data eq new Error("hoge")')

        console.log('# JSON.stringify(err)')
        const json = JSON.stringify(err)
        tt.ok(/^{.*"message"\s*:\s*"Internal error".*}$/.test(json), 'ok /^{.*"message"\s*:\s*"Internal error".*}$/.test(json)')
        tt.ok(/^{.*"code"\s*:\s*-32603.*}$/.test(json), 'ok /^{.*"code"\s*:\s*-32603.*}$/.test(json)')
        tt.ok(/^{.*"data"\s*:\s*"\[?Error:\s?hoge\]?".*}$/.test(json), 'ok /^{.*"data"\s*:\s*"\\[?Error:\\s?hoge\\]?".*}$/.test(json)')
        console.log('# %s', json)
        tt.end()
    })

    t.end()
})
