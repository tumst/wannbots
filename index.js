'use strict';

const express = require('express');
//const line = require('@line/bot-sdk');

// ENV
const PORT = process.env.PORT || 9090;
//console.log(PORT);

//console.log(process.env.PROJECT_NAME);

const app = express();

app.get("/test", (req, res) => {
	var responseObj = {
		status: true,
		data: {text: "hello"}
	};
	
	res.json(responseObj);
});


app.get("/webhook", (req, res) => {
	console.log('This  is webhook.');
	res.send("webhook?");
});




app.listen(PORT, () => {
	console.log('application is listen on: ', PORT);
});



