const path = require('path');

module.exports = {
  development: process.env.NODE_ENV !== 'production',
  paths: {
    controllers: path.resolve(__dirname, '..', 'controller'),
    swagger: path.resolve(__dirname, '..', 'swagger', 'swagger.json')
  },
  port: 3000
};
