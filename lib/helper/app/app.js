'use strict';

/* eslint-disable new-cap */

const express = require('express');
const middleware = require('swagger-express-middleware');

const SwaggerRouter = require('../../middleware/swagger-router');
const handleRequest = require('../../middleware/swagger-request-handler');
const validateResponse = require('../../middleware/swagger-response-validator');
const handleError = require('../../middleware/swagger-error-handler');
const sendResponse = require('../../middleware/swagger-response-sender');

/**
 * @class
 */
class App {
  /**
   * @param {Object.<string, string>} options.paths The paths to the resources
   * @param {string} options.paths.controllers The paths to the controllers
   * @param {string} options.paths.swagger The paths to the swagger root file
   * @constructor
   * @private
   */
  constructor(paths) {
    this.paths = paths;
    this.app = express();
  }

  /**
   * @param {Object} middleware
   * @param {Object} api
   * @private
   */
  initialize(middleware, api) {
    const swaggerRouter = new SwaggerRouter({
      swagger: api,
      paths: this.paths,
    });

    this.app.locals.swagger = api;
    this.app.disable('x-powered-by');

    this.app.use(middleware.metadata());
    this.app.use(middleware.CORS());
    this.app.use(middleware.parseRequest());
    this.app.use(middleware.validateRequest());

    this.app.use(swaggerRouter.router);
    this.app.use(handleRequest);
    this.app.use(validateResponse);
    this.app.use(handleError);
    this.app.use(sendResponse);
  }

  /**
   * @return {Promise.<express.Application>}
   * @private
   */
  start() {
    return new Promise((resolve, reject) => {
      middleware(this.paths.swagger, this.app, (error, middleware, api) => {
        if (error) {
          return reject(error);
        }

        this.initialize(middleware, api);
        resolve(this.app);
      });
    });
  }
}

/**
 * @type {console|Object}
 */
App.logger = console;


module.exports = App;