const http = require('http');
const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

const HTML_FILE = path.join(__dirname, 'index.html');

const HUB_SECRET = process.env.HUB_SECRET || 'sr-hub-secret-2026-change-me';
const HUB_URL = 'https://hub.socialremedy.com.au/';

function verifyToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const [email, expires, sig] = parts;
    if (Date.now() > parseInt(expires)) return false;
    const expectedSig = crypto.createHmac('sha256', HUB_SECRET).update(`${email}:${expires}`).digest('hex');
    return sig === expectedSig;
  } catch { return false; }
}

function isAuthed(req) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/sr_auth=([^;]+)/);
  return match && verifyToken(match[1]);
}

const server = http.createServer((req, res) => {

  if (!isAuthed(req)) {
    res.writeHead(302, { 'Location': HUB_URL });
    res.end();
    return;
  }

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
