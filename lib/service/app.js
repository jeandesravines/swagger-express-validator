const express = require('express');
const winston = require('winston');
const SwaggerParser = require('swagger-parser');
const createMiddleware = require('swagger-express-middleware');
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
   * @param {Object.<string>} options.paths - the paths to the resources
   * @param {string} options.paths.controllers - the paths to the controllers
   * @param {string} options.paths.swagger - paths to the swagger root file
   * @param {express.App} [options.app] - an app
   * @param {Object.<Object>} [options.hooks] - some middleware's hooks
   * @param {Object.<Function>} [options.logger] - a logger
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
     * @const {Object.<Function>}
     */
    this.hooks = hooks || {};

    /**
     * @type {Object}
     */
    this.logger = logger || winston;

    /**
     * @type {Object.<string, string>}
     */
    this.paths = paths;
  }

  /**
   * @param {Object} middleware The swagger-express-middleware
   * @param {Object} api - the Swagger definition
   * @return {Promise.<express.App>} - a Promise resolved with an App
   * @private
   */
  initialize(middleware, api) {
    return SwaggerParser.validate(api)
      .then(() => this.initializeApp(api))
      .then(() => this.initializeRouter())
      .then(() => this.initializeMiddlewares(middleware))
      .then(() => this.app);
  }

  /**
   * @param {Object} middleware The swagger-express-middleware
   * @param {Object} api - the Swagger definition
   * @private
   */
  initializeApp(api) {
    this.api = api;
    this.app.locals.api = this.api;
    this.app.locals.logger = this.logger;
    this.app.disable('x-powered-by');
  }

  /**
   * @private
   */
  initializeRouter() {
    this.router = new SwaggerRouter({
      api: this.api,
      paths: this.paths,
    });

    this.router.initialize();
  }

  /**
   * @param {Object} middleware - the swagger-express-middleware
   * @private
   */
  initializeMiddlewares(middleware) {
    const mapping = new Map();

    mapping.set("metadata", middleware.metadata);
    mapping.set("cors", middleware.CORS);
    mapping.set("requestParser", middleware.parseRequest);
    mapping.set("requestValidator", middleware.validateRequest);
    mapping.set("swaggerRouter", () => this.router.middleware.bind(this.router));
    mapping.set("requestHandler", () => RequestHandler.middleware.bind(RequestHandler));
    mapping.set("requestPerformer", () => RequestPerformer.middleware.bind(RequestPerformer));
    mapping.set("responseValidator", () => ResponseValidator.middleware.bind(ResponseValidator));
    mapping.set("responseSender", () => ResponseSender.middleware.bind(ResponseSender));
    mapping.set("errorHandler", () => ErrorHandler.middleware.bind(ErrorHandler));

    mapping.forEach((middleware, name) => {
      const hooks = this.hooks[name] || {};
      const before = hooks.before;
      const after = hooks.after;

      if (before) {
        this.app.use(before());
      }

      this.app.use(middleware());

      if (after) {
        this.app.use(after());
      }
    });
  }

  /**
   * @private
   */
  onCreateMiddleware(error, middleware, api) {
    return error ?
      Promise.reject(error) :
      this.initialize(middleware, api);
  }

  /**
   * @return {Promise.<express.Application>}
   * @private
   */
  start() {
    return new Promise((resolve, reject) => {
      createMiddleware(
        this.paths.swagger,
        this.app,
        (error, middleware, api) => {
          this.onCreateMiddleware(error, middleware, api)
            .then(resolve, reject);
        }
      );
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