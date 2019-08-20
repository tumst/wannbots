'use strict';

const botTalking = (messages) => {
	//return "message form botTalking." + messages;
	let msg = '';
	if (messages == 'hello') {
		msg = "Hi, How are you!";
	};
		
	if (messages === 'order') {
		msg = "ยังไม่ทำอ่ะ...";
	}
	return msg
}

module.exports = {
	botTalking
}
