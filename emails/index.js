// API emailer

const http = require('http');

const emailer = {};

emailer.send = (datum, cb) => {

	console.log('DATUM-emailer: ', datum);
	let message = JSON.stringify({
		"from":datum.payload.from,
		"to":datum.payload.to,
		"subject":datum.payload.subject,
		"text":datum.payload.text
	});

	const options = {
		hostname:'api.mailgun.net',
		path:'/v3/sandboxa29aec1210574cdc966b91e1ec6c56e4.mailgun.org/messages',
		port: 443,
		auth:'api:b108c4a1c964e1e7386bc4eaa30b1ce3-4836d8f5-a17dc999',
		method:'POST',
		headers:{
			'Content-Length': message.length,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};

	let req = http.request(options, (res) => {
		console.log('STATUS:', res.statusCode);
		console.log('HEADERS:', JSON.stringify(res.headers));

		//res.setEncoding('utf8');

		res.on('data', (chunk) => {
			process.stdout.write(chunk)
		});

		res.on('end', () => {
			console.log('No more data in response.');
		});
	});


	req.on('error', (err) => {
		console.log('ERROR: ', err);
		console.log('Problem with request:', err.message);
	});

	req.write(message);
	req.end();
	cb({status:200, emailed:true, payload: datum.payload});

};


module.exports = emailer;

// {
// 	"from":"alex@mova.club",
// 	"to":"seeusers@gmail.com",
// 	"subject":"A Message",
// 	"text":"Mailgun testing message"
// }