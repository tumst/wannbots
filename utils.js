'use strict';

const queryStringParser = (queryString) => {
	// example: queryString = "action=no&itemid=0L-1-0001"
	
	// splite query by sign '&'
	const querySplit = queryString.split('&');
	// querySplit[i] is i(th) query
	
	let res = {};
	querySplit.forEach((kv)=> {
		// split key and value by sign '='  
		const k_v = kv.split('=');
		// res[key] = value
		res[k_v[0]] = decodeURIComponent(k_v[1] || '');
	});
	return res;
}

module.exports = {
	queryStringParser
}