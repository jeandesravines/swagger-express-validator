const express = require('express');
const SwaggerParser = require('swagger-parser');
const middleware = require('swagger-express-middleware');
const SwaggerRouter = require('../middleware/swagger-router');
const RequestHandler = require('../middleware/request-handler');
const RequestPerformer = require('../middleware/request-performer');
const ResponseValidator = require('../middleware/response-validator');
const ResponseSender = require('../middleware/response-sender');
const ErrorHandler = require('../middleware/error-handler');

/**
 * @class
 */
class App {
  /**
   * @param {Object} options - some options
   * @param {Object.<string, string>} options.paths - the paths to the resources
   * @param {string} options.paths.controllers - the paths to the controllers
   * @param {string} options.paths.swagger - paths to the swagger root file
   * @param {Object} [options.logger] - a logger
   * @constructor
   * @private
   */
  constructor(options) {
    const {
      app,
      hooks,
      logger,
      paths
    } = options;

    /**
     * @type {express.App}
     */
    this.app = app || express();

    /**
     * @type {Object}
     */
    this.logger = logger || new Proxy({}, {
      get: () => () => void 0
    });

    /**
     * @const {Object}
     */
    this.hook = hooks || [];

    /**
     * @type {Object.<string, string>}
     */
    this.paths = paths;
  }

  /**
   * @param {Object} middleware The swagger-express-middleware
   * @param {Object} api - the Swagger definition
   * @return {Promise.<express.App>} - a Promise resolved with an app
   * @private
   */
  initialize(middleware, api) {
    return SwaggerParser.validate(api)
      .then(() => this.initializeApp(middleware, api));
  }

  /**
   * @param {Object} middleware The swagger-express-middleware
   * @param {Object} api - the Swagger definition
   * @return {Promise.<express.App>} - a Promise resolved with an app
   * @private
   */
  initializeApp(middleware, api) {
    const swaggerRouter = new SwaggerRouter({
      swagger: api,
      paths: this.paths,
    });

    this.app.locals.swagger = api;
    this.app.locals.logger = this.logger;
    this.app.disable('x-powered-by');

    this.app.use(
      middleware.metadata(),
      // eslint-disable-next-line new-cap
      middleware.CORS(),
      middleware.parseRequest(),
      middleware.validateRequest(),
      swaggerRouter.middleware,
      RequestHandler.middleware,
      RequestPerformer.middleware,
      ResponseValidator.middleware,
      ResponseSender.middleware,
      ErrorHandler.middleware
    );

    return this.app;
  }

  /**
   * @return {Promise.<express.Application>}
   * @private
   */
  start() {
    return new Promise((resolve, reject) => {
      middleware(this.paths.swagger, this.app, (error, middleware, api) => {
        error ?
          reject(error) :
          resolve(this.initialize(middleware, api));
      });
    });
  }

  /**
   * @param {Object} options - some options
   * @param {Object.<string, string>} options.paths - the paths to the resources
   * @param {string} options.paths.controllers - the paths to the controllers
   * @param {string} options.paths.swagger - paths to the swagger root file
   * @param {Object} [options.logger] - a logger
   * @return {Promise.<express.Application>}
   */
  static start(options) {
    return new App(options)
      .start();
  }
}

module.exports = App;