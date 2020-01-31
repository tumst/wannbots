'use strict'

const { replyText } = require('./botActionMessage')
const { botTalking } = require('./botTalking')
const { queryStringParser } = require('./utils')
// const { rabbitWorker } = require('./rabbitMQ')
const { firebaser } = require('./firebaser')

const handleEvent = event => {
  console.log('this is handle event')
  let replyToken = ''
  let messages = ''

  const currentTime = new Date().getTime()
  switch (event.type) {
    case 'postback':
      console.log('postback')
      /* data from : events.type == postback
			{
				"events":[{
					"type":"postback",
					"replyToken":"faf68708dc52404ea7e03086ec50b310",
					"source":{"userId":"Ubc443e4bf8f5e0bb76430e1b75110171","type":"user"},
					"timestamp":1566295057240,
					"postback":{"data":"action=no&itemid=0L-1-0001"}}],
				"destination":"U145ddadaa81c8e3fcc74cbfb5c97847a"
			}
	    */
      replyToken = event.replyToken
      // replyTime = event.timestamp
      // diffTime = currentTime - replyTime
      const replyDateTime = new Date(event.timestamp)
      const rDate = replyDateTime.getDate()
      const rMonth = replyDateTime.getMonth() + 1
      const rYear = replyDateTime.getFullYear()

      const postbackObj = queryStringParser(event.postback.data)
      const topicname = postbackObj.topicname
      const queueName = postbackObj.queueName
      const msgAction = postbackObj.action
      const pushTimestamp = postbackObj.timestamp
      console.log(pushTimestamp)
      const pushDateTime = new Date(parseInt(pushTimestamp))
      console.log(pushDateTime)
      const pDate = pushDateTime.getDate()
      const pMonth = pushDateTime.getMonth() + 1
      const pYear = pushDateTime.getFullYear()
      console.log('check datetime')
      console.log(postbackObj)
      console.log(rDate + '  ' + rMonth + '  ' + rYear)
      console.log(pDate + '  ' + pMonth + '  ' + pYear)
      if (rDate === pDate && rMonth === pMonth && rYear === pYear) {
        const subQueueName = queueName.substring(0, 22)
        switch (subQueueName) {
          case 'rawmat_receive_isempty':
            // TODO: send message if action = yes to RabbitMQ on wann server
            if (msgAction === 'yes') {
              console.log('Confirm template : yes')
              // messages = [{ type: 'text', text: 'action:' + msgAction + ' is successful.' }]
              messages = [
                {
                  type: 'text',
                  text: 'ฉลากถูกปริ้นท์เรียบร้อย....'
                }
              ]
              // rabbitWorker(queueName, postbackObj)
              // rabbitWorker(queueName, event.postback.data)

              // change rabbitmq to firebase
              firebaser(queueName, event.postback.data)
              replyText(replyToken, messages)
              return 'yes'
            } else if (msgAction === 'no') {
              console.log('Confirm template : no')
              //rabbitWorker(queueName, postbackObj)
              // rabbitWorker(queueName, event.postback.data)

              // change rabbitmq to firebase
              firebaser(queueName, event.postback.data)
              // return replyText(replyToken, 'no')
              return 'no'
            }
            break
          case 'approve_rawmat_picking':
            if (msgAction === 'yes') {
              // action=yes&RawPK=188328&isauthen=1&timestamp=1579577950588&queueName=approve_rawmat_picking
              console.log('Confirm template approve: yes')
              messages = [
                {
                  type: 'text',
                  text: 'อนุมัติเรียบร้อย.....'
                }
              ]
              // rabbitWorker(queueName, event.postback.data)

              // change rabbitmq to firebase
              firebaser(queueName, event.postback.data)

              replyText(replyToken, messages)
              return 'yes'
            } else if (msgAction === 'no') {
              // action=no&RawPK=188328&isauthen=1&timestamp=1579577950588&queueName=approve_rawmat_picking
              console.log('Confirm template approve: no')
              // rabbitWorker(queueName, event.postback.data)

              // change rabbitmq to firebase
              firebaser(queueName, event.postback.data)
              return 'no'
            }
            break
          default:
            console.log('queueName : default...')
        }
      } else {
        console.log('date not match.')
      }
      break

    case 'message':
    case 'text':
      replyToken = event.replyToken
      const msgText = event.message.text
      const msgReply = botTalking(msgText)

      // return message
      messages = [
        {
          type: 'text',
          text: msgReply
        }
      ]
      // sent reply message to bot
      if (msgReply != '') {
        return replyText(replyToken, messages)
      } else {
        console.log('This message do not reply.')
        return Promise.resolve(null)
      }

      break

    default:
      return Promise.resolve(null)
  }
}

module.exports = {
  handleEvent
}
