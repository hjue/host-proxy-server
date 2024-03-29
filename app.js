const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const ipaddr = require('ipaddr.js');

const HOST = 'localhost';
const PORT = 3000;
const app = express();
app.disable('x-powered-by');

var parseUrl = function (path) {
  let ps = path.split('/');
  if (ps.length <= 3) return null;
  let host = ps[2];
  for (let i = 0; i < 3; i++) ps.shift();
  return { host: host, path: '/' + ps.join('/') };
};
const options = {
  target: `http://${HOST}:${PORT}`,
  changeOrigin: true,
  router: function (req) {
    let newPath = parseUrl(req.originalUrl);

    if (!newPath) return '';
    let host = newPath.host.split(':')[0];
    if (!ipaddr.isValid(host)) {
      console.log('无效的主机：' + host);
      return '';
    }
    if (ipaddr.parse(host).range() == 'private') {
      console.log('无效的主机：' + host);
      return '';
    }
    console.log('-->  ', req.method, req.originalUrl, '->', `http://${newPath.host}${newPath.path}`);
    return `http://${newPath.host}`;
  },
  pathRewrite: function (path) {
    let newPath = parseUrl(path);
    return newPath ? `${newPath.path}` : '/';
  },
  onError: function (err, req, res) {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end('Internal Server Error');
  },
};

const proxyServer = createProxyMiddleware(options);

app.use('/431387eb7262e1cfc79b125eb8a67c60', proxyServer);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Starting Proxy at ${PORT}`);
});
