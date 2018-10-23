// usr session methods

// prerequisites
const fs = require('fs');
const path = require('path');

// session DB file
const sidb = path.join(__dirname, './session.db');

// module methods
const session = {};

// session list empty or not
let empty = true;

// get all session records
session.get = () => {

	let sids = []; // session IDs

	fs.readFileSync(sidb, 'utf-8').split(/[\n\r]+/).forEach((line) => {
		let one = [];
		if(typeof(line) !== 'undefined' && line.match(/^\d/)){
			one = line.split(/[|]/); // '|' - line separator
			sids.push({
				uid:one[0], // user id
				sid:one[1]  // session id
			});
			empty = false;
		}
	});

	return ({empty, sids});
};

// save sids to DB: always UPDATED list
session.save = (sidList, cb) => {
	let error = ''; // error string
	fs.open(sidb, 'w', (err, FD) => {
		if(!err && FD){

			fs.writeFile(FD, sidList, (err) => {
				if(!err){
					// close FD
					fs.close(FD, (err) => {
						if(!err){
							cb(error);
						} else {
							error += 'Error closing DB file.';
							console.log(error);
							cb(error);
						}
					});
				} else {
					error += 'Error writing to DB file.';
					console.log(error);
					cb(error);
				}
			});

		} else {
			error += 'Cannot open sid DB file.';
			console.log(error);
			cb(error);
		}
	});
};

module.exports = session;

// {
//   "email":"a@mail.ua",
//   "full_name":"Don Xiqo",
//   "str_addr":"1-a Parlm Str.",
//   "password":"IKNOW"
// }
//
// {
//   "email":"b@mail.in",
//   "full_name":"Fig Wam",
//   "str_addr":"2-b PengYou Str.",
//   "password":"youKNOW"
// }

// {
//   "email":"c@outlook.com",
//   "full_name":"Billy Willy",
//   "str_addr":"3301 Califonia Str.",
//   "password":"theyKNOW"
// }