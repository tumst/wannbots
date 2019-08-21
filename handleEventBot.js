'use strict'

const { replyText } = require('./botActionMessage')
const { botTalking } = require('./botTalking')
const { queryStringParser } = require('./utils')

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
      const msgAction = postbackObj.action

      messages = [{ type: 'text', text: 'action:' + msgAction + ' is successful.' }]

      // sent reply message to bot
      return replyText(replyToken, messages)
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
      return replyText(replyToken, messages)
      break

    default:
      return Promise.resolve(null)
  }
}

module.exports = {
  handleEvent
}
