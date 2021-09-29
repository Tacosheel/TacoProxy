# [Taco Proxy](https://tacoproxy.ml)
### A node.js web proxy for use in combating web filters featuring URL encoding

# Updates
```
(Updated 9/28/21): Discontinued and Archived | TacoProxy v2 Alpha will be released, and will not be updated.
```

# Security
### VirusTotal:
[TacoProxy.ml | 8/18/21](https://www.virustotal.com/gui/url/beccb55681f2a9271bdb05ceea452dedfde6c1fa5a35226215337453e3ce56d5/detection)

[Proxy.Tacosheel.dev | 8/18/21 ](https://www.virustotal.com/gui/url/a0be55c705daaa5481d52e897327813e46847a73b372bb83f2e3e769e87f4c99/detection)

### SSL/TLS:
Taco Proxy is encrypted with the latest TLS 1.3

Since Heroku does not support SSL Certificates for free dynos, I am currently using Cloudfare Flexible.

### Email Address Obfuscation

Displays obfuscated email addresses on Taco Proxy to prevent harvesting by bots and spammers

# Speed
There a lot of speed improvements since Aero Proxy, mainly including:

- Brotli Compression
- Rocket Loader
- Auto Minify
- Cloudfare Caching
- Arc.io Caching

##### PageSpeed rating of [94/100](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Ftacoproxy.ml%2F&tab=desktop) 

# Domains
[TacoProxy.ml](https://tacoproxy.ml)

[Proxy.Tacosheel.dev](https://proxy.tacosheel.dev)

# Deploy
<a href="https://heroku.com/deploy?template=https://github.com/Tacosheel/TacoProxy" title="Deploy to Heroku"><img alt="Deploy to Heroku" src="https://raw.githubusercontent.com/QuiteAFancyEmerald/HolyUnblockerPublic/master/views/assets/img/heroku.svg?raw" width="140" height="30"><img></a>
&nbsp;
<a href="https://azuredeploy.net/" title="Deploy to Azure"><img alt="Deploy to Azure" src="https://raw.githubusercontent.com/QuiteAFancyEmerald/HolyUnblockerPublic/master/views/assets/img/azure.svg?raw" width="140" height="30"><img></a>
&nbsp;
<a href="https://repl.it/github/titaniumnetwork-dev/alloyproxy/tree/alloyheroku-v1" title="Run on Repl.it"><img alt="Run on Repl.it" src="https://raw.githubusercontent.com/QuiteAFancyEmerald/HolyUnblockerPublic/master/views/assets/img/replit.svg?raw" width="140" height="30"><img></a>
&nbsp;

# How to Use
### Module Use

1. `npm install alloyproxy`

2. Set all of your configs in the main file for the Node app.

3. Start up your app and unblock a website at `/prefix/[BASE64 ENCODED WEBSITE ORIGIN]/`. The path of the website does not have to be B64 encoded.

A good example of what code to use is here using the Express.js framework.

### Sample Express Application
1. Navigate to the `/examples/` folder.

2. Do the following commands:

```
cd examples/express

npm install

npm start
```

The demo application will run at `localhost:8080` by default however the port can be configured in `config.json`.

The static folder provides you with the base site if you wish to go manual about this.

### Sample Implementation 
Add this to your server-side script ex. "app.js".
```
// Note: make sure you use Alloy before any other Express middleware that sends responses to client or handles POST data.

const Alloy = require('alloyproxy'),
    http = require('http'),
    express = require('express'),
    app = express();
    
const server = http.createServer(app);   

const Unblocker = new Alloy({
    prefix: '/fetch/',
    request: [],
    response: [],
    injection: true,
});    
 
// The main part of the proxy. 
 
app.use(Unblocker.app);    

// WebSocket handler.

Unblocker.ws(server);    

server.listen('8080')

```

## Configurations
### General Use

```
    prefix: '/prefix/',
    blocklist: [],
    // error: (proxy) => { return res.end('proxy.error.info.message') },  Custom error handling which is optional.
    request: [], // Add custom functions before request is made or modify the request.
    response: [], // Add custom functions after the request is made or modify the response.
    injection: true, // Script injection which is helpful in rewriting window.fetch() and all kinds of client-side JS requests.
    requestAgent: null, // Set a custom agent to use in the request.
    // userAgent: Uses the clients "User-Agent" request header by default. More customizable using the "request" option in the configs.
    localAddress: [] // Neat feature in basic http(s).request() to choose what IP to use to make the request. Will be randomized if there is multiple.
```

### Extended Configuration Information

To use the "request" and "response" options in the config. You must make a function like this for example.

```
customFunction = (proxy) => {

  if (proxy.url.hostname == 'example.org' && proxy.response.headers['content-type'].startsWith('text/html')) {
  
    return proxy.sendResponse == proxy.sendResponse.toString().replace(/example/gi, 'cat :3');
  
  };

};

new Alloy({
prefix: '/prefix/',
blocklist: [],
// error: (proxy) => { return res.end('proxy.error.info.message') },  Custom error handling which is optional.
request: [], // Add custom functions before request is made or modify the request.
response: [
    
  customFunction
    
], // Add custom functions after the request is made or modify the response.
injection: true, // Script injection which is helpful in rewriting window.fetch() and all kinds of client-side JS requests.
requestAgent: null, // Set a custom agent to use in the request.
// userAgent: Uses the clients "User-Agent" request header by default. More customizable using the "request" option in the configs.
localAddress: [] // Neat feature in basic http(s).request() to choose what IP to use to make the request. Will be randomized if there is multiple.
})
```

What this will do is when the hostname of a website being accessed is `example.org`. The console sends you "weee :3". If you want a preview of what options you have, heres a list. :)

```

// Basic HTTP functions.

proxy.req // This is the request option in HTTP servers. If Express.js is being used, you can use Express.js functions.
proxy.res // This is the response option in HTTP servers. If Express.js is being used, you can use Express.js functions.
proxy.next() // This is only avaliable in Express.js . If used in native HTTP, the app will display blank text as a filler.

// Request

proxy.request.headers // A modified version of the client's request headers used in sending the request.
proxy.request.method // The clients request method.
proxy.request.body // The POST body of a POST / PATCH request. 

// Response

proxy.response // The entire response of the website. Contains headers, JSON / text response, and all Node.js http(s).request() response data.
proxy.response.headers // Response headers the website gave back. Is modified to filter out bad headers, and rewrite "Set-Cookie" header.
proxy.sendResponse // The modified response buffer the website gave back. You can modify it in anyway you desire. :)

// Errors

proxy.error.status // Outputs "true" when theres an error.
proxy.error.info // Gives information about an error.
proxy.error.info.code // Gives error code. Error codes such as "ENOTFOUND" mean a website could not be found. "BLOCKED" means a website is blocked.
proxy.error.info.message // Gives error message.
proxy.blocked.status // Outputs "true" when a filtered hostname is detected.

```

# Credits
- [Titanium Network](https://github.com/titaniumnetwork-dev)
- [QuiteAFancyEmerald](https://github.com/QuiteAFancyEmerald)
- [Jason](https://github.com/caracal-js)
- [B3ATDROP3R](https://github.com/B3ATDROP3R)
- [shirt](https://github.com/shirt-dev)
- [Xproassassinn](https://github.com/Xproassassinn)

# License 
![GitHub](https://img.shields.io/github/license/tacosheel/tacoproxy?style=for-the-badge)
```
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
### Copyright (c) 2020-2021 Tacosheel
