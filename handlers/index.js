// handlers & helpers

// prerequisites
// const crypto = require('crypto');

// user-defined libs
const menu = require('./../menu'); // index.js - module
const users = require('./../users'); // index.js - module, users.json - user DB

// reusable user object
const user = {
  id       :null,
  full_name:'',
  str_addr: '',
  password: '',
  email:    ''
};

const handlers = {};

// create a new user acc: data - user object: { /- see above -/ }
handlers.usrAdd = (data, cb) => {

  if (typeof(data) !== 'undefined'){ // a subtle trait of checking

    user.full_name = data.full_name;
    user.str_addr  = data.str_addr;
    user.password  = data.password;
    user.email     = data.email;
    cb({status:200,saved:true});


  } else {
    cb({status:200,saved:false});
  }
  console.log('handlers.usrAdd: ', user);

//   users.create(user, (err) => {
//
//   });
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
  const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
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