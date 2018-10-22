// handlers & helpers

// prerequisites
// const crypto = require('crypto');

// user-defined libs
const menu = require('./../menu'); // index.js - module
const users = require('./../users'); // index.js - module, users.json - user DB

// reusable user object
// const user = {
//   id       :null,
//   full_name:'',
//   str_addr: '',
//   password: '',
//   email:    ''
// };


const handlers = {};

// create a new user - save in users.db
handlers.usrAdd = (datum, cb) => {

	if (typeof(datum) !== 'undefined'){ // a subtle trait of checking

		let uid = 1; // new user id

		if( datum.usrobj.empty === false ){
			uid = datum.usrobj.usrList.length + 1;
		}

// 		datum.usrobj.usrList.push( { id:       uid,
// 																full_name: datum.payload.full_name,
// 																email:     datum.payload.email,
// 																str_addr:  datum.payload.str_addr,
// 																password:  datum.payload.password } );
		let userListString = '';
		let userList = [];
		// compile list of user strings (entries in db format)
		datum.usrobj.usrList.forEach((oneUser) => {
			userList.push(`${oneUser.id}|${oneUser.full_name}|${oneUser.email}|${oneUser.str_addr}|${ oneUser.password}`);
		});
		userList.push(`${uid}|${datum.payload.full_name}|${datum.payload.email}|${datum.payload.str_addr}|${ datum.payload.password}`);
		// compile a final user string
		userListString = userList.join("\n");
// 		userList.forEach((oneUser) => {
// 			userListString += oneUser + "\n";
// 		});

		console.log('userListString: ', userListString);

		// save in users db
		users.save(userListString, (err) => {
			console.log("ERRor: ", err);
			cb({status:200,saved:true, error: err});
		});


  } else {
    cb({status:406,saved:false}); // not acceptable
  }
};

// upd a user record
handlers.usrUpd = (data, cb) => {
  user = data;

};

// del a user record
handlers.usrDel = (data, cb) => {
  user = data;

};


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

// TEST: menu output
// handlers.menu = () => console.log(menu);

// exported
module.exports = handlers;