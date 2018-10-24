// handlers & helpers

// prerequisites
const qs = require("querystring");
const crypto = require('crypto');
const http = require('http');

// user-defined libs
// const emails = require('./../emails'); // index.js - module
const menu = require('./../menu'); // index.js - module
const users = require('./../users'); // users.db - user DB
const sessions = require('./../sessions'); // index.js - module, session.db - session DB

const handlers = {};

handlers.email = (datum, cb) => {

// 	console.log('DATUM-emailer: ', datum);

	let message = qs.stringify({
		"from":datum.payload.from,
		"to":datum.payload.to,
		"subject":datum.payload.subject,
		"text":datum.payload.text
	});

	const options = {
		"hostname": "api.mailgun.net",
		"path": "/v3/sandboxa29aec1210574cdc966b91e1ec6c56e4.mailgun.org/messages",

		"auth":"api:b108c4a1c964e1e7386bc4eaa30b1ce3-4836d8f5-a17dc999",
		"method":"POST",
		"headers":{
			'Content-Length': message.length,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};
	let error = '';
	let response = {};

	let req = http.request(options, (res) => {
		response = res;
		console.log('STATUS:', res.statusCode);
		console.log('HEADERS:', JSON.stringify(res.headers));
		let chunks = [];

		res.on('data', (chunk) => {
			chunks.push(chunk);
		});

		res.on('end', () => {
			body = Buffer.concat(chunks);
			console.log(body.toString());
		});


	});

	req.on('error', (err) => { error = JSON.stringify(err); console.log('EEEERRR: ', err)});
	req.write(message);
	req.end();
	cb({status:200, response: response, error:error});

};

handlers.usrLogin = (datum, cb) => {

  let sidList = sessions.get();
	let usrList = users.get().usrList;
//   console.log('PAYload: ', datum.payload);
//   console.log('users: ', users);
// 	console.log('sidList: ', sidList);

  if ( typeof(datum) == 'object' &&
			typeof(datum.payload) == 'object' &&
			datum.payload.email &&
			datum.payload.password ){

    // find the user record
    let registered = false; // email & pswd found or not
    let logged = false; // logged already or not
    let uid = null; // found user ID
    let sid = null; // a new sid

    for(let i=0; i<usrList.length; i++){
			if( datum.payload.email == usrList[i]['email'] &&
				handlers.hash(datum.payload.password) == usrList[i]['password'] ){
				registered = true;
        uid = usrList[i]['id'];
      }
    }

    if(registered){

			for(let i = 0; i < sidList.sids.length; i++){
				if ( sidList.sids[i]['uid'] == uid ){
					logged = true;
					cb({status:200, logged:true, error:'', sid:sidList.sids[i]['sid'], uid: uid});
				}
			}

			if(!logged){
				// just create and add sid
	      sid = handlers.createRandomString();
				let sidString = `${uid}|${sid}\n`;

				for(let i = 0; i < sidList.sids.length; i++){
					sidString += `${sidList.sids[i]['uid']}|${sidList.sids[i]['sid']}\n`;
				}

				sessions.save(sidString, (err) => {
					cb({status:200, logged:true, error:'', sid:sid, uid: uid});
				});
			}

    } else {
			cb({status:200,logged:false, error: 'Invalid login or password', sid: null});
		}
    // send response
   // cb({status:200, login:logged, error:'', sid:sid, uid: uid});

	} else {
		cb({status:406,logged:false, error: 'Invalid login data', sid: null}); // not acceptable
	}
};

handlers.usrLogout = (datum, cb) => {

	let sidList = sessions.get();

	if ( typeof(datum) == 'object' &&
		typeof(datum.payload) == 'object' &&
					 datum.payload.sid ){
			for(let i = 0; i < sidList.sids.length; i++){

				if ( sidList.sids[i]['sid'] == datum.payload.sid ){
					sidList.sids.splice(i,1);
					let sidString = '';

					for(let i = 0; i < sidList.sids.length; i++){
						sidString += `${sidList.sids[i]['uid']}|${sidList.sids[i]['sid']}\n`;
					}

					sessions.save(sidString, (err) => {
						cb({status:200,  error:''});
					});
				}
			}
		} else {
			cb({status:406,logout:false, error: 'Logout data invalid'}); // not acceptable
		}
};

// create a new user - save in users.db
handlers.usrAdd = (datum, cb) => {

	// quick check of user input
	if ( typeof(datum) == 'object' &&
			typeof(datum.payload) == 'object' &&
			datum.payload.full_name &&
			datum.payload.email &&
			datum.payload.str_addr &&
			datum.payload.password ){

		let uid = 1; // new user id

		if( datum.usrobj.empty === false ){
			for (let i = 0; i < datum.usrobj.usrList.length; i++){ // let's get the highest uid
				uid = uid < datum.usrobj.usrList[i]['id'] ? parseInt(datum.usrobj.usrList[i]['id']) : parseInt(uid);
			}
			uid +=1; // new uid
		}

		let userListString = '';
		let userList = [];

		// compile list of user strings (entries in db format)
		datum.usrobj.usrList.forEach((oneUser) => {
			userList.push(`${oneUser.id}|${oneUser.full_name}|${oneUser.email}|${oneUser.str_addr}|${ oneUser.password }`);
		});

		userList.push(`${uid}|${datum.payload.full_name}|${datum.payload.email}|${datum.payload.str_addr}|${ handlers.hash(datum.payload.password)}`);

		// compile a final user string
		userListString = userList.join("\n");

		//console.log('userListString: ', userListString);

		// save in users db
		users.save(userListString, (err) => {
			//console.log("ERRor: ", err);
			cb({status:200,saved:true, error: err});
		});


  } else {
		cb({status:406,saved:false, error: 'Invalid input data'}); // not acceptable
  }
};

// upd a user record
handlers.usrUpd = (datum, cb) => {

	// quick check of user input
	if ( typeof(datum) == 'object' &&
			typeof(datum.payload) == 'object' &&
			datum.payload.id &&
			datum.payload.full_name &&
			datum.payload.email &&
			datum.payload.str_addr &&
			datum.payload.password ){

		// find an exisisting user record
		for (let i = 0; i < datum.usrobj.usrList.length; i++){
			if ( datum.payload.id == datum.usrobj.usrList[i]['id'] )
				datum.usrobj.usrList[i] = datum.payload;
		}

		let userListString = '';
		let userList = [];

		// compile list of user strings (entries in db format)
		datum.usrobj.usrList.forEach((oneUser) => {
      userList.push(`${oneUser.id}|${oneUser.full_name}|${oneUser.email}|${oneUser.str_addr}|${ oneUser.password}`); // TODO:encrypt password
		});

		// compile a final user string
		userListString = userList.join("\n");

		// save in users db
		users.save(userListString, (err) => {
			cb({status:200,updated:true, error: err});
		});


  } else {
		cb({status:406,updated:false, error: 'Invalid input data'}); // not acceptable
}};

// del a user record
handlers.usrDel = (datum, cb) => {

	// quick check of user input
	if ( typeof(datum) == 'object' &&
			typeof(datum.payload) == 'object' &&
			datum.payload.id ){

		// find an exisisting user record
		for (let i = 0; i < datum.usrobj.usrList.length; i++){
			if ( datum.payload.id == datum.usrobj.usrList[i]['id'] )
				datum.usrobj.usrList.splice(i,1);
		}

		let userListString = '';
		let userList = [];

		// compile list of user strings (entries in db format)
		datum.usrobj.usrList.forEach((oneUser) => {
			userList.push(`${oneUser.id}|${oneUser.full_name}|${oneUser.email}|${oneUser.str_addr}|${ oneUser.password}`);
		});

		// compile a final user string
		userListString = userList.join("\n");

		// save in users db
		users.save(userListString, (err) => {
			cb({status:200,deleted:true, error: err});
		});


  } else {
		cb({status:406,deleted:false, error: 'Invalid input data'}); // not acceptable
}};


// Not-Found method status
handlers.notFound = (data,callback) => {
  callback(404);
};


// Create a session id (SID)
handlers.createRandomString = () => {

  // generator alphabet
  const possibleCharacters = '-ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
  let str = '';
  for(i = 1; i <= 13; i++) {
      // Get a random charactert from the possibleCharacters string
      let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      // Append this character to the string
      str+=randomCharacter;
  }
  // Return the final string
  return str;
};

// Create a SHA256 hash
handlers.hash = function(str){
	if(typeof(str) == 'string' && str.length > 0){
		var hash = crypto.createHmac('sha256', 'nothingCompareToYou').update(str).digest('hex');
		return hash;
	} else {
		return false;
	}
};

// TEST: menu output
// handlers.menu = () => console.log(menu);

// exported
module.exports = handlers;