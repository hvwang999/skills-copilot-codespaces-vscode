// Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const comments = require('./comments');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;
  const query = parsedUrl.query;
  if (pathName === '/api/comments' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(comments));
  } else if (pathName === '/api/comments' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      const newComment = JSON.parse(body);
      comments.push(newComment);
      res.end('Comment added');
    });
  } else {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});