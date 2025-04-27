// frontend/src/setupProxy.js
module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      next();
    });
  };