const http = require('http')

const router = [{
  path: '*',
  method: '*',
  handle: function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('404');
  }
}];

const app = {
  
  get(path, fn) {
    router.push({
      path: path,
      method: "GET",
      handle: fn
    });
  },

  listen(port, cb) {
  
    const server = http.createServer((req, res) => {
  
      if (!res.send) {
        res.send = function(body) {
          res.writeHead(200, {
            "Content-Type": "text/plain"
          });
          res.end(body);
        };
      }
  
      for (let i = 1; i < router.length; i += 1) {
        if (
          (req.url === router[i].path || router[i].path === "*") &&
          (req.method === router[i].method || router[i].method === "*")
        ) {
          return router[i].handle && router[i].handle(req, res);
        }
      }
  
      return router[0].handle && router[0].handle(req, res);
    });
  
    return server.listen.apply(server, arguments);
  }
}

module.exports = app
