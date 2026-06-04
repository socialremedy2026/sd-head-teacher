const http = require('http');
const fs   = require('fs');
const path = require('path');

const HTML_FILE = path.join(__dirname, 'index.html');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(HTML_FILE).pipe(res);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(3005, () => {
  console.log('SD Head Teacher report running at http://localhost:3005');
});
