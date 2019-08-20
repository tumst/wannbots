'use strict';

const express = require('express');
//const line = require('@line/bot-sdk');
const bodyParser = require('body-parser');
const request = require('request');

require('dotenv').config();

const { botTalking } = require('./botTalking');

// ENV
const PORT = process.env.PORT || 9090;
const NODE_ENV = process.env.NODE_ENV;
console.log('node env: ' + NODE_ENV);
//console.log(PORT);

//console.log(process.env.PROJECT_NAME);
const accessToken = "YtD6c7bQAWqGS2a6p4oB/7FkLcVGmdja3PBqvtotg4AJJcchR8PGzdNGDpJ795PEtb4ukM9iVf+pBB7YThdYAlKvs1GKdfdGm7ICGmaw2/SaxqbB2oRXwtkjYULVtBAcHLFi4nL+rvYHFqtnCNqZCgdB04t89/1O/w1cDnyilFU=";
const channelSecret = "7f8679ab0686dc60f256f1d45288c389";
const lineConfig = {
	"channelAccessToken": accessToken,
	"channelSecret": channelSecret
};

// Header
let headers = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer {' + accessToken + '}'
}

// create line sdk client
//const lineClient = new line.Client(lineConfig);

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function handleEvent(event) {
	switch (event.type) {
		case 'postback':
			
			break;
		case 'message':
		case 'text':
			const replyToken = event.replyToken;
			const msgText = event.message.text;
			const msgReply = botTalking(msgText);
			
			let messages = [
				{
					type: 'text',
					text: msgReply
				}
			]
			// sent function to bot
			replyText(replyToken, messages);
			break;
		default:
			
		
	}
}

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
	const to_id = req.body.to;
	// console.log('id: ' + id);
	pushText(to_id, msg);
	res.sendStatus(200);
});

app.post("/webhook", (req, res) => {
	//console.log('This  is webhook.');
	//console.log(req.body.events);
	
	if (req.body.events != undefined) {
		console.log('send from line');
		console.log(JSON.stringify(req.body));
		
		// Promise.all
		Promise
			.all(req.body.events.map(handleEvent))
			.then((result) => res.json(result));
			
	}
	//res.send("webhook?");
	res.sendStatus(200);
});

function pushText(id, message) {
	console.log('pushText');
	console.log(NODE_ENV);
	let body = {
		to: id,
		messages: message
	};
	
	let bodyJson = JSON.stringify(body);
	console.log(bodyJson);
	
	if (NODE_ENV === 'virtualline') {
		request.post({
			url: 'https://api.line.me/v2/bot/message/push',
			headers: headers,
			body: bodyJson
		}, (err, res, body) => {
			console.log('push status = ' + res.statusCode);
		});
		console.log('== virtualline');
	} else {
		console.log('do not push.');
		console.log(bodyJson);
	}
}

function replyText(replyToken, message) {
	console.log('replyText');
	console.log(NODE_ENV);
	let body = {
		replyToken: replyToken,
		messages: message
	};
	
	let bodyJson = JSON.stringify(body);
	console.log(bodyJson);
	
	if (NODE_ENV != 'virtualline') {
		request.post({
			url: 'https://api.line.me/v2/bot/message/reply',
			headers: headers,
			body: bodyJson
		}, (err, res, body) => {
			console.log('reply status = ' + res.statusCode);
		});
		console.log('!= virtualline');
	} else {
		console.log('do not reply');
	}
}

app.listen(PORT, () => {
	console.log('application is listen on: ', PORT);
});



