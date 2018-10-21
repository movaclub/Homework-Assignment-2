// a helper script: read txt file line by line into obj

const fs = require('fs');
let lines = [];

fs.readFileSync('./alist.txt', 'utf-8').split(/[\r\n]+/).forEach((line) => {
  let one = line.split(/[|]/);
  lines.push({
    id:one[0],
    full_name:one[1],
    email:one[2],
    str_addr:one[3],
    password:one[4]
  });

});
  console.log('OBJ: ', lines);

// const ops = {
//   flags: 'r',
//   encoding: 'utf-8',
//   autoClose: true,
//   start: 0,
//   end: Infinity,
//   highWaterMark: 64 * 1024
// };
//
// const stream = fs.createReadStream('./alist.txt', ops);
//
// stream.on('data', (chunk) => console.log(chunk));
// stream.on('end', () => {console.log('ended...')});