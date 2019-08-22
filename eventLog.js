'use strict'

const request = require('request')

const url_wann = 'http://wanncosmetics.ddns.net:9051'

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
      console.log('log status = ' + res.statusCode)
    }
  )
}

module.exports = { eventLoggingPostToWann }
