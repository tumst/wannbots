'use strict';

const express = require('express');
//const line = require('@line/bot-sdk');
const bodyParser = require('body-parser');
const request = require('request');

const { botTalking } = require('./botTalking');

// ENV
const PORT = process.env.PORT || 9090;
//console.log(PORT);

// Header
let headers = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer {' + accessToken + '}'
}

//console.log(process.env.PROJECT_NAME);
const accessToken = "YtD6c7bQAWqGS2a6p4oB/7FkLcVGmdja3PBqvtotg4AJJcchR8PGzdNGDpJ795PEtb4ukM9iVf+pBB7YThdYAlKvs1GKdfdGm7ICGmaw2/SaxqbB2oRXwtkjYULVtBAcHLFi4nL+rvYHFqtnCNqZCgdB04t89/1O/w1cDnyilFU=";
const channelSecret = "7f8679ab0686dc60f256f1d45288c389";
const lineConfig = {
	"channelAccessToken": accessToken,
	"channelSecret": channelSecret
};
// create line sdk client
//const lineClient = new line.Client(lineConfig);


const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get("/", (req, res) => {
	res.send('This is home webhook...!!!');
});

app.get("/test", (req, res) => {
	var responseObj = {
		status: true,
		data: {text: "hello"}
	};
	console.log(responseObj);
	res.json(responseObj);
});


app.post("/notify", (req, res) => {
	// bot notify when push messages
	const msg = req.body.messages;
	const id = req.body.id;
	
	pushText(id, msg);
});

app.post("/webhook", (req, res) => {
	//console.log('This  is webhook.');
	//console.log(req.body.events);
	
	if (req.body.events != undefined) {
		console.log('send from line');
		console.log(req.body.events);
		let replyToken = req.body.events[0].replyToken;
		
		// const event = req.body.events
		// TODO: line event type
		// handleEvent();
		// TODO: bot answer here if event.type.message == text
		const msgText = req.body.events[0].message.text;
		let msgReply = botTalking(msgText);
		
		/* if (message == 'hello') {
			let msg = "Hi!";
			reply(replyToken, msg);
		};
		
		if (message === 'order') {
			let msg = "ยังไม่ทำอ่ะ...";
			replyText(replyToken, msg);
		} */
		
		replyText(replyToken, msgReply);
	}
	//res.send("webhook?");
	res.sendStatus(200);
});

function pushText(id, message) {
	let body = {
		id: id,
		messages: [
			{
				type: 'text',
				text: message
			}
		]
	};
	
	let bodyJson = JSON.stringify(body);
	request.post({
		url: 'https://api.line.me/v2/bot/message/push',
		headers: headers,
		body: bodyJson
	}, (err, res, body) => {
		console.log('push status = ' + res.statusCode);
	});
}

function replyText(replyToken, message) {
	
	let body = {
		replyToken: replyToken,
		messages: [
			{
				type: 'text',
				text: message
			}
		]
	};
	
	let bodyJson = JSON.stringify(body);
	
	request.post({
		url: 'https://api.line.me/v2/bot/message/reply',
		headers: headers,
		body: bodyJson
	}, (err, res, body) => {
		console.log('reply status = ' + res.statusCode);
	});
}

app.listen(PORT, () => {
	console.log('application is listen on: ', PORT);
});



