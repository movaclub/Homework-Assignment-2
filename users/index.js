// user DB interface

// prerequisites
const fs = require('fs');

// user DB file
const udb = './users.json';

// module methods
const users = {};

// append a new user to DB
users.create = (data, cb) => {
  fs.open(udb, 'a+', (err, FD) => { // a+	Open file for reading and appending. The file is created if it does not exist.
    if(!err && FD){

      let usrString = JSON.stringify(data) + "\n";

      // write to and close the db file
      fs.writeFile(FD, usrString, (err) => {

        if(!err){

          fs.close(FD, (err) =>{
            if(!err){
              cb(false);
            } else {
              cb('Error closing db file');
            }
          });

        } else {
          cb('Error writing to db file');
        }

      })


    } else {
      console.log('Cannot open user DB file.');
    }
  });
};


// exported singleton

module.exports = users;

