'use strict'

const confirmRawmatNextReceived = (title, dataString) => {
  console.log('confirm rawmaterial more than 1 then 1st is empty stock and use next one(received id).')
  msgConfirm = {
    type: 'template',
    altText: 'this is confirm next rawmaterial received template',
    template: {
      type: 'confirm',
      text: title,
      actions: [
        {
          type: 'postback',
          label: 'Yes',
          data: 'action=yes&itemId=0L-1-0001&receivedId=R1590/15'
        },
        {
          type: 'postback',
          label: 'No',
          data: 'action=no&itemid=0L-1-0001'
        }
      ]
    }
  }
}

module.exports = {}
