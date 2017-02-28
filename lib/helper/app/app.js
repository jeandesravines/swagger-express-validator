'use strict';

/* eslint-disable new-cap */

const express = require('express');
const middleware = require('swagger-express-middleware');

const SwaggerRouter = require('../../middleware/router');
const requestHandler = require('../../middleware/request-handler');
const requestPerformer = require('../../middleware/request-performer');
const responseValidator = require('../../middleware/response-validator');
const responseSender = require('../../middleware/response-sender');
const errorHandler = require('../../middleware/error-handler');

/**
 * @class
 */
class App {
  /**
   * @param {Object.<string, string>} paths The paths to the resources
   * @param {string} paths.controllers The paths to the controllers
   * @param {string} paths.swagger The paths to the swagger root file
   * @param {Object} [logger] A logger
   * @constructor
   * @private
   */
  constructor(paths, logger) {
    this.paths = paths;
    this.logger = logger || console;
    this.app = express();
  }

  /**
   * @param {Object} middleware
   * @param {Object} api
   * @private
   */
  initialize(middleware, api, logger) {
    const swaggerRouter = new SwaggerRouter({
      swagger: api,
      paths: this.paths,
    });

    this.app.locals.swagger = api;
    this.app.locals.logger = this.logger;
    this.app.disable('x-powered-by');

    this.app.use(middleware.metadata());
    this.app.use(middleware.CORS());
    this.app.use(middleware.parseRequest());
    this.app.use(middleware.validateRequest());

    this.app.use(swaggerRouter.router);
    this.app.use(requestHandler);
    this.app.use(requestPerformer);
    this.app.use(responseValidator);
    this.app.use(responseSender);
    this.app.use(errorHandler);
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

  /**
   * @param {Object.<string, string>} paths The paths to the resources
   * @param {string} paths.controllers The paths to the controllers
   * @param {string} paths.swagger The paths to the swagger root file
   * @param {Object} [logger] A logger
   * @return {Promise.<express.Application>}
   */
  static start(paths, logger) {
    return new App(paths, logger)
      .start();
  }
}


module.exports = App;
