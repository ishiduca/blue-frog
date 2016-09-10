'use strict'
var client = require('./client')
var d = document

d.querySelector('#createAccount').onsubmit = function (ev) {
    var uri  = location.origin
    var frog = client(uri)

    var $me = ev.target
    var $accountName = $me.querySelector('input[name="account_name"]')
    var $accountPwd  = $me.querySelector('input[name="account_password"]')
    var $accountNick = $me.querySelector('input[name="account_nickname"]')

    var req1 = frog.request('createAccount', {
        name:     $accountName.value.trim()
      , password: $accountPwd.value.trim()
    })

    var req2
    if ($accountNick.value.trim()) {
        req2 = frog.notification('addNickname', {
            nickname: $accountNick.value.trim()
        })
    }

    var req3 = frog.request('getAccount')

    frog.on('error', onError)
    req1.on('error', onError)
    req2.on('error', onError)
    req3.on('error', onError)

    req1.once('data', function (result) {
        console.log('# req1 result')
        console.dir(result)
    })
    req3.once('data', function (result) {
        console.log('# req3 result')
        console.dir(result)
    })

    var arry = [req1]
    if (req2) arry.push(req2)
    arry.push(req3)

    frog.batch(arry)
}

function onError (err) {
    console.log(err)
}
