// handlers

// prerequisites

// user-defined libs
const menu = require('./../menu'); // index.js - module
const users = require('./../users'); // index.js - module, users.json - user DB

// reusable user object
const user = {
  full_name:'',
  str_addr: '',
  password: '',
  email:    ''
};

const handlers = {};

// create a new user acc: data - user object: { /- see above -/ }
handlers.usrAdd = (data, cb) => {

  user.full_name = data.full_name;
  user.str_addr  = data.str_addr;
  user.password  = data.password;
  user.email     = data.email;

  users.create(user, (err) => {

  });
};

// upd a user record
handlers.usrUpd = (data, cb) => {
  user = data;

};

// del a user record
handlers.usrDel = (data, cb) => {
  user = data;

};

// TEST: menu output
// handlers.menu = () => console.log(menu);

// exported
module.exports = handlers;