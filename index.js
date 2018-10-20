// index.js - app entry point & web server
// prerequisites
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// handers - app useful methods
const handlers = require('./handlers'); // index.js - module

// console.log("MENU: ", menu);

// handlers
// handlers.menu();

let server = http.createServer((req,res) => {

  // parse URL
  let parsedUrl = url.parse(req.url, true);

  // get a clean URL path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get the HTTP method
  let method = req.method.toLowerCase();



  // get headers

  // res.end('server is up & running...');
});

server.listen(3000, () => {
  console.log('server is up & running on port 3000');
});