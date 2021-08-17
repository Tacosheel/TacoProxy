/* -----------------------------------------------
/* Author : Titanium Network
/* MIT license: http://opensource.org/licenses/MIT
/* ----------------------------------------------- */

const express = require('express'),
    alloy = require('alloyproxy'),
    app = express(),
    http = require('http'),
    fs = require('fs'),
    path = require('path');

const config = JSON.parse(fs.readFileSync('./config.json', {
    encoding: 'utf8'
}));

const server = http.createServer(app);

//Local Alloy Proxy

const localprox = new alloy({
    prefix: '/prefix/',
    error: (proxy) => {
        return proxy.res.send(fs.readFileSync(path.join(__dirname, 'public', 'error.html'), 'utf8'));
    },
    request: [],
    response: [],
    injection: true
});

app.use(localprox.app);

localprox.ws(server);

//Cloudflare Attack Mode Fix

app.post('/', async (req, res) => {
    switch (req.url) {
        case '/':
            return res.send(fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8'));
    }
});

//Querystring Navigation
app.get('/', async (req, res) => {

    switch (req.url) {
        case '/':
            return res.send(fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8'));
    }

    switch (req.url) {
        case '/?a':
            return res.send(fs.readFileSync(path.join(__dirname, 'public', 'error.html'), 'utf8'));
    }

});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(process.env.PORT || config.port);
