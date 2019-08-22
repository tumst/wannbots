'use strict'

const request = require('request')

url_wann = 'http://wanncosmetics.ddns.net:9051'

const headers = {
  'Content-Type': 'application/json'
}

const eventLoggingPostToWann = lineBody => {
  request.post(
    {
      url: url_wann + '/linelog',
      headers: headers,
      body: lineBody
    },
    (err, res, body) => {
      console.log('push status = ' + res.statusCode)
    }
  )
}

module.exports = { eventLoggingPostToWann }
