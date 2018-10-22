// index.js - app entry point & web server
// prerequisites
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// handers - app useful methods
const handlers = require('./handlers'); // index.js - module
const users = require('./users'); // users db, etc

// the server acceptable HTTP methods
const acceptableMethods = ['post','get','put','delete'];

// API routes
const routes = {
  'user/add': handlers.usrAdd, // payload = user obj
	'user/upd': handlers.usrUpd, // payload = user obj
	'user/del': handlers.usrDel  // payload = user id
};

// get initial user list, 'empty` - list is empty if true
let usrobj = users.get();
// console.log('USROBJ: ', usrobj);
let userList = usrobj.usrList;
let empty = usrobj.empty;
console.log('usrList: ', usrobj.usrList);

let server = http.createServer((req,res) => {

  // parse URL
  let parsedUrl = url.parse(req.url, true);

  // get a clean URL path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get the HTTP method
  let method = req.method.toLowerCase();

  // get the headers
  let headers = req.headers;

  // get the payload, if any
  let decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  // spit out the response
  req.on('end', () => {

    buffer += decoder.end();

    const datum = {
      'trimmedPath': trimmedPath,
      'method'     : method,
      'headers'    : headers,
			 'usrobj'    : usrobj
    };

    // console.log('DATUM: ', datum);
    res.setHeader('Content-Type', 'application/json');

    // method check
    if ( acceptableMethods.indexOf(method) > -1 ){

			// payload is there if POST only
			datum.payload = method == 'post' ? JSON.parse(buffer) : null;

      // process the request
      if ( typeof(routes[trimmedPath]) !== 'undefined' ){
        let chosenHandler = routes[trimmedPath];
        chosenHandler(datum, (ret) => {
					usrobj = users.get();
// 					console.log('USROBJ.empty: ', usrobj.empty);
// 					console.log('USROBJ: ', usrobj);
          res.writeHead(ret.status);
          res.end(JSON.stringify(ret));
        });

      } else {
          res.writeHead(404); // not found
          res.end();
      }

    } else {
          res.writeHead(405); // not allowed
          res.end();
    }

  });


});

server.listen(3000, () => {
  console.log('server is up & running on port 3000');
});