'use strict'
const amqp = require('amqplib/callback_api')

const rabbitWorker = (queueName, messages) => {
  //const url = 'amqp://guest:guest@192.168.1.204'
  // const url = 'amqp://guest:guest@192.168.1.204:5672'
  const url = 'amqp://guest:guest@wanncosmetics.ddns.net:5672'

  console.log(url)
  amqp.connect(url, function(error0, connection) {
    console.log('inside amqp connect')
    if (error0) {
      console.log(error0)
      throw error0
    }
    console.log('creating channel')
    connection.createChannel(function(error1, channel) {
      console.log('created channel')
      if (error1) {
        console.log(error1)
        throw error1
      }
      //var queue = 'rawmat_receive_isempty'
      const queue = queueName
      const msg = messages
      console.log(queue)
      console.log(msg)
      channel.assertQueue(queue, {
        //durable: false
        durable: true
      })

      //channel.sendToQueue(queue, Buffer.from(msg))
      channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true
      })
      console.log(' [x] Sent %s', msg)
    })
    setTimeout(() => {
      connection.close()
      //process.exit(0)
    }, 500)
  })
}

module.exports = {
  rabbitWorker
}
