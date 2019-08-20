'use strict';

const { queryStringParser } = require('./utils');

const queryString = "action=no&itemid=0L-1-0001";

const obj = queryStringParser(queryString);
console.log(obj);
console.log(obj.action);
console.log(obj.itemid);

