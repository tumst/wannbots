'use strict'

const request = require('request')

// env
// Token
const accessToken = process.env.ACCESS_TOKEN
const NODE_ENV = process.env.NODE_ENV
console.log('node env: ' + NODE_ENV)

// Header
let headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer {' + accessToken + '}'
}

const pushText = (id, message) => {
  console.log('pushText')
  console.log(NODE_ENV)
  console.log(headers)

  let body = {
    to: id,
    messages: message
  }

  let bodyJson = JSON.stringify(body)
  console.log(bodyJson)

  if (NODE_ENV === 'production') {
    request.post(
      {
        url: 'https://api.line.me/v2/bot/message/push',
        headers: headers,
        body: bodyJson
      },
      (err, res, body) => {
        console.log('push status = ' + res.statusCode)
      }
    )
    console.log('== production')
  } else {
    console.log('do not push.')
    console.log(bodyJson)
  }
}

const replyText = (replyToken, message) => {
  console.log('replyText')
  console.log(NODE_ENV)
  console.log(headers)

  let body = {
    replyToken: replyToken,
    messages: message
  }

  let bodyJson = JSON.stringify(body)
  console.log(bodyJson)

  if (NODE_ENV === 'production') {
    request.post(
      {
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: bodyJson
      },
      (err, res, body) => {
        console.log('reply status = ' + res.statusCode)
        return res.statusCode
      }
    )
    console.log('== production')
  } else {
    console.log('do not reply')
    return false
  }
}

module.exports = {
  replyText,
  pushText
}
