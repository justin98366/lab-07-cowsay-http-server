'use strict';

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const cowsay = require('cowsay');

const bodyParse = (req, callback) => {
  if(req.method === 'POST' || req.method === 'PUT'){
    let body = '';
    req.on('data', (buf) => {
      body += buf.toString();
    });
    req.on('end', () => callback(null, body));
    req.on('err', (err) => callback(err));
  } else {
    callback(null, '{}');
  }
};

const server = http.createServer((req, res) => {
  req.url = url.parse(req.url);
  req.url.query = querystring.parse(req.url.query);
  console.log('req.url', req.url);
  console.log('req.method', req.method);
  bodyParse(req, (err, body) => {
    if(err) {
      res.writeHead(500);
      res.end();
      return;
    }

    try {
      req.body = JSON.parse(body);
    } catch (err) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.write(cowsay.say({text: 'bad request\ntry: localhost:3000/cowsay?text=howdy'}));
      res.end();
      return;
    }

    if(req.url.pathname === '/'){
      res.writeHead(200, {
        'Content-Type' : 'text/plain',
      });
      res.write('hello world\n');
      res.end();
      return;
    }

    if(req.method === 'GET' && req.url.pathname === '/cowsay' && req.url.query.text != undefined){
      res.writeHead(200, {
        'Content-Type' : 'text/plain',
      });
      res.write(cowsay.say({
        text: `${req.url.query.text}`,
      }));
      res.end();
      return;
    }

    if(req.method === 'GET' && req.url.pathname === '/cowsay' && req.url.query.text === undefined){
      res.writeHead(400, {
        'Content-Type' : 'test/plain',
      });
      res.write(cowsay.say({
        text: 'bad request\ntry: localhost:3000/cowsay?text=howdy',
      }));
      res.end();
      return;
    }

    if(req.method === 'POST' && req.url.pathname === '/cowsay' && req.body.text != undefined){
      res.writeHead(200, {
        'Content-Type' : 'text/plain',
      });
      res.write(cowsay.say({
        text: `${req.body.text}`,
      }));
      res.end();
      return;
    }

    if(req.method === 'POST' && req.url.pathname === '/cowsay' && req.body.text === undefined){
      res.writeHead(400, {
        'Content-Type' : 'test/plain',
      });
      res.write(cowsay.say({
        text: 'bad request\ntry: localhost:3000/cowsay?text=howdy',
      }));
      res.end();
      return;
    }
    res.writeHead(404);
    res.end();
  });

});

server.listen(3000, () => {
  console.log('server up :: 3000');
});
