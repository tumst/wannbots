'use strict';

const express = require('express');
//const line = require('@line/bot-sdk');
const bodyParser = require('body-parser')
const request = require('request')

// ENV
const PORT = process.env.PORT || 9090;
//console.log(PORT);

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
	res.send('This is home webhok...!!!');
});

app.get("/test", (req, res) => {
	var responseObj = {
		status: true,
		data: {text: "hello"}
	};
	
	res.json(responseObj);
});


app.get("/webhook", (req, res) => {
	console.log('This  is webhook.');
	let replyToken = req.body.events[0].replyToken;
	let message = req.body.events[0].message.text;
	
	if (message == 'hello') {
		msg = "Hi!";
		reply(replyToken, msg);
	};
	res.send("webhook?");
});

function reply(replyToken, message) {
	let headers = {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer {' + accessToken + '}'
	}
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
		url: 'http://api.line.me/v2/bot/message/reply',
		headers: headers,
		body: bodyJson
	}, (err, res, body) => {
		console.log('status = ' + res.statusCode);
	});
}

app.listen(PORT, () => {
	console.log('application is listen on: ', PORT);
});



