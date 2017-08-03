const path = require('path');

module.exports = {
  logLevel: 'debug',
  paths: {
    controllers: path.resolve(__dirname, '..', 'controller'),
    swagger: path.resolve(__dirname, '..', 'swagger', 'swagger.json')
  },
  port: 3000
};
