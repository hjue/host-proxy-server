const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const ipaddr = require('ipaddr.js');

const HOST= process.env.HOST?process.env.HOST:'localhost'
const PORT= process.env.PORT?process.env.PORT:3000
const app = express();

var parseUrl = function (path) {
  let ps = path.split('/')
  if (ps.length <= 3 )
    return null;
  let host = ps[2]
  for (let i = 0;i<3;i++) ps.shift()
  return {'host':host, 'path':'/' + ps.join('/')}
}
const options = {
  target: `http://${HOST}:${PORT}`,
  changeOrigin: true,
  router: function (req) {
    let newPath = parseUrl(req.originalUrl) 
    if(!newPath) return ''
    let host = newPath.host.split(':')[0]
    if(!ipaddr.isValid(host)) {
      console.log('无效的主机：' + host)
      return ''
    }
    if(ipaddr.parse(host).range()=='private') {
      console.log('无效的主机：' + host)
      return ''
    }
    return newPath?`http://${newPath.host}`:''
  },
  pathRewrite: function (path, req) { 
    newPath = parseUrl(path)
    return newPath?`http://${newPath.path}`:''
  }
}

const proxyServer = createProxyMiddleware(options);

app.use('/431387eb7262e1cfc79b125eb8a67c60', proxyServer);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, HOST,() => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});