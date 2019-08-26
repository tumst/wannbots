'use strict'

const rabbitWorker = (queueName, messages) => {
  const url = 'amqp://guest:guest@192.168.1.204'
  amqp.connect(url, function(error0, connection) {
    if (error0) {
      throw error0
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1
      }
      //var queue = 'rawmat_receive_isempty'
      const queue = queueName
      const msg = messages

      channel.assertQueue(queue, {
        durable: false
      })

      channel.sendToQueue(queue, Buffer.from(msg))
      console.log(' [x] Sent %s', msg)
    })
  })
}

module.exports = {
  rabbitWorker
}
