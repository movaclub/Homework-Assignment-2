// handlers & helpers

// prerequisites
const crypto = require('crypto');

// user-defined libs
const menu = require('./../menu'); // index.js - module
const users = require('./../users'); // users.db - user DB
const sessions = require('./../sessions'); // index.js - module, session.db - session DB

const handlers = {};

handlers.usrLogin = (datum, cb) => {

  let sidList = sessions.get();
	let usrList = users.get().usrList;
  console.log('PAYload: ', datum.payload);
  console.log('users: ', users);
  console.log('sidList: ', sidList);

  if ( typeof(datum) == 'object' &&
			typeof(datum.payload) == 'object' &&
			datum.payload.email &&
			datum.payload.password ){

    // find the user record
    let logged = false; // email & pswd found or not
    let uid = null; // found user ID
    let sid = null; // a new sid

    for(let i=0; i<usrList.length; i++){
			if( datum.payload.email == usrList[i]['email'] &&
				handlers.hash(datum.payload.password) == usrList[i]['password'] ){
        logged = true;
        uid = usrList[i]['id'];
      }
    }

    if(logged){
      if(!sidList.empty){
        // find and delete sid, if uid
        // create and add a new sid
      } else {
        // just create and add sid
        sid = handlers.createRandomString();
      }
    }
    // send response
    cb({status:200, login:logged, error:'', sid:sid, uid: uid});

	} else {
		cb({status:406,login:false, error: 'Invalid login or password', sid: null}); // not acceptable
	}
};

handlers.usrLogout = (datum, cb) => {
	if ( typeof(datum) == 'object' &&
		typeof(datum.payload) == 'object' &&
		datum.payload.sid ){
			// do logout
		} else {
			cb({status:406,logout:false, error: 'Logout failed'}); // not acceptable
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