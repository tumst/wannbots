'use strict'

const express = require('express')
const line = require('@line/bot-sdk')
const bodyParser = require('body-parser')

// require('dotenv').config()

// custom library
const { handleEvent } = require('./handleEventBot')
const { pushText } = require('./botActionMessage')
// const { rabbitWorker } = require('./rabbitMQ')

// http
// const http = require('http')

// ENV
const PORT = process.env.PORT || 9090

// Token
const accessToken = process.env.ACCESS_TOKEN
const channelSecret = process.env.CHANNEL_SECRET

// Line config with token
const lineConfig = {
  channelAccessToken: accessToken,
  channelSecret: channelSecret
}

// create line sdk client
// const lineClient = new line.Client(lineConfig)

// create express app
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// express routing
app.get('/', (req, res) => {
  res.send('This is home webhook...!!!')
})

app.get('/test', (req, res) => {
  var responseObj = {
    status: true,
    data: { text: 'hello' }
  }
  console.log(responseObj)
  res.json(responseObj)
})

// app.get('/api/invoices', (req, res) => {
//   // const url = "http://wanncosmetics.ddns.net:65001/test"
//   const poId = req.query.poId;
//   // const url = "http://wanncosmetics.ddns.net:65003/invoices/?poId=VCL25-11-19%2F04"
//   const url = "http://wanncosmetics.ddns.net:65003/invoices/?poId="+poId

//   http.get(url, (resp) => {
//     console.log('http get')
//     let data = '';
    
//     // A chunk of data has been recieved.
//     resp.on('data', (chunk) => {
//       // console.log('on data chunk...')
//       data += chunk;
//     });
    
//     // The whole response has been received. Print out the result.
//     resp.on('end', () => {
//       console.log('on end ')
//       console.log(JSON.parse(data));
//       res.json(JSON.parse(data))
//     });
    
//   }).on("error", (err) => {
//     console.log("Error: " + err.message);
//   });
// })

// app.get('/taskqueue', (req, res) => {
//   // taskqueue?msg=xdfjdksalfdkfa
//   console.log('task queue...')
//   // console.log(JSON.stringify(req.body))
//   const msg = req.query.msg
//   const queueName = "test_taskqueue"
//   rabbitWorker(queueName, msg)
// })

app.post('/notify', (req, res) => {
  // bot notify when push messages
  const now = new Date()
  console.log(`\n--------------------- begin notify :: ${now.toISOString()} ------------------`)
  console.log(req.body)
  const msg = req.body.messages
  const to_id = req.body.to
  // console.log('id: ' + id);
  pushText(to_id, msg)
  res.sendStatus(200)
})

app.post('/webhook', (req, res) => {
  //console.log('This  is webhook.');
  //console.log(req.body.events);

  if (req.body.events != undefined) {
    console.log('send from line')
    console.log(JSON.stringify(req.body))

    // Promise.all
    Promise.all(req.body.events.map(handleEvent)).then(result => {
      //res.json(result)
      console.log('Promise.all res')
      console.log(result)
      console.log('*********** end reply webhook ************')
    })
  }
  //res.send("webhook?");

  res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log('application is listen on: ', PORT)
})
