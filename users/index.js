// user DB interface

// prerequisites
const fs = require('fs');
const path = require('path');

// user DB file
const udb = path.join(__dirname,'./users.db');
// const udb = path.join(__dirname,'./../alist.txt');

// module methods
const users = {};


// user list empty or not
let empty = true;

// get all users in obj: used by API only
users.get = () => {

	// usual user list
	let usrList = [];
	fs.readFileSync(udb, 'utf-8').split(/[\r\n]+/).forEach((line) => {

		let one = [];

		if (typeof(line) !== 'undefined' && line.match(/^\d/)){

			one = line.split(/[|]/); // '|' - line separator
	    usrList.push({id:       one[0],
	                  full_name:one[1],
	                  email:    one[2],
	                  str_addr: one[3],
	                  password: one[4] });
			empty = false;
		}

	});

	return ({empty, usrList});

};

// save usr list to DB: the whole UPDATED list of users from memory is written to the truncated db file
users.save = (usrList, cb) => { // usrList - join'ed & piped string of user(s)
	let error = ''; // error string: appended with one or more error messages, if any
	fs.open(udb, 'w', (err, FD) => { // udb - users.db file
    if(!err && FD){

					fs.writeFile(FD, usrList, (err) => {
						if(!err){
							// close FD
							fs.close(FD, (err) => {
								if(!err){
									cb(error);
								}
							});
						} else {
							error += 'Error closing user DB file.';
							console.log(error);
							cb(error);
						}
					});

    } else {
			error += 'Cannot open user DB file.';
			console.log(error);
			cb(error);
    }
  });
};


// exported singleton

module.exports = users;

