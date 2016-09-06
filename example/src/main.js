'use strict'
var hyperquest = require('hyperquest')
var through    = require('through2')
var body       = require('body/json')
var rpc        = require('blue-frog')

var d = document

d.querySelector('#createAccount').onsubmit = function (ev) {
    var uri = location.origin
    var batch = rpc.request.BatchStream('do JSON stringify')
    var hyp   = hyperquest.post(uri)

    batch.on('error', onError)
    .pipe(through.obj(function (json, _, done) {
        hyp.setHeader('content-type', 'application/json')
        hyp.setHeader('content-length', Buffer.byteLength(json))
        done(null, json)
    }))
    .pipe(hyp).on('error', onError)
    .once('response', function (res) {
        body(res, null, function (err, response) {
            if (err) return onError(err)

            rpc.response.ParseStream(response).on('error', onError)
            .pipe(through.obj(function (result, _, done) {
                console.dir(result)
                setTimeout(done, 500)
            }))
        })
    })

    var $me = ev.target
    var $accountName = $me.querySelector('input[name="account_name"]')
    var $accountPwd  = $me.querySelector('input[name="account_password"]')
    var $accountNick = $me.querySelector('input[name="account_nickname"]')

    batch.write(rpc.request(Date.now().toString(), 'createAccount', {
        name:     $accountName.value.trim()
      , password: $accountPwd.value.trim()
    }))
    if ($accountNick.value.trim()) {
        batch.write(rpc.request.notification('addNickname', {
            nickname: $accountNick.value.trim()
        }))
    }
    batch.end()
}

function onError (err) {
    console.error(err)
}
