const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://foundry-reviews.dev.lbl.gov',
      changeOrigin: true,
      secure: false,
    })
  );
};

