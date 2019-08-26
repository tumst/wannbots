'use strict'

const { replyText } = require('./botActionMessage')
const { botTalking } = require('./botTalking')
const { queryStringParser } = require('./utils')
const { rabbitWoker } = require('./rabbitMQ')

const handleEvent = event => {
  console.log('this is handle event')
  let replyToken = ''
  let messages = ''

  switch (event.type) {
    case 'postback':
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
      const postbackObj = queryStringParser(event.postback.data)
      const actionName = postbackObj.actionName
      const msgAction = postbackObj.action

      switch (actionName) {
        case 'rawmat_receive_isempty':
          // TODO: send message if action = yes to RabbitMQ on wann server
          if (msgAction === 'yes') {
            console.log('Confirm template : yes')
            // messages = [{ type: 'text', text: 'action:' + msgAction + ' is successful.' }]
            messages = [
              {
                type: 'text',
                text: 'ฉลากถูกปริ้นท์เรียบร้อย...'
              }
            ]
            rabbitWoker(actionName, msgAction)
            replyText(replyToken, 'yes')
            return 'yes'
          } else if (msgAction === 'no') {
            console.log('Confirm template : no')
            return replyText(replyToken, 'no')
            return 'no'
          }
          break
        default:
          console.log('actionName : default...')
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
