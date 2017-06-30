const path = require('path');
const express = require('express');
const NotFoundError = require('../error/common/not-found-error');

/**
 * @class SwaggerRouter
 */
class SwaggerRouter {
  /**
   * @param {Object} options
   * @param {Object} options.api - swagger definition
   * @param {Object.<string, string>} options.paths - the paths to the resources
   * @param {string} options.paths.controllers - the paths to the controllers
   */
  constructor(options) {
    /**
     * @const {Object}
     * @private
     */
    this.api = options.api;

    /**
     * @const {Object.<string, string>}
     * @private
     */
    this.paths = options.paths;

    /**
     * @const {Function}
     * @private
     */
    this.router = new express.Router();
  }
  
  /**
   * @return {express.Router}
   */
  get middleware() {
    return this.router;
  }

  /**
   * @private
   */
  initialize() {
    this.setDefaultRoute();
    this.setRoutes();
  }

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {Function} next
   */
  defaultRouteMiddleware(req, res, next) {
    if (!req.swagger.operation) {
      return next(new NotFoundError(req.path, req.method));
    }

    next();
  }

  /**
   * @param {Object} controller
   * @param {Function} handler
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {Function} next
   */
  routeMiddleware(controller, handler, req, res, next) {
    req.app.locals.logger.debug('Router.middleware', {
      method: req.method,
      path: req.path,
      controller: controller.constructor.name,
      handler: handler.name,
    });

    req.container = {
      handler: handler.bind(controller),
      logger: req.app.locals.logger
    };

    next();
  }

  /**
   * @private
   */
  setDefaultRoute() {
    this.router.all('*', this.defaultRouteMiddleware.bind(this));
  }

  /**
   * @private
   */
  setRoutes() {
    const controllersPath = this.paths.controllers;
    const paths = this.api.paths;
    const basePath = this.api.basePath;

    const routePathRegExp = /{(\w+)}/g;
    const controllerPrefixRegExp = /\/([^/]+)/;

    Object.keys(paths).forEach((key) => {
      const pathDefinition = paths[key];
      const routePath = basePath + key.replace(routePathRegExp, ':$1');
      const controllerPrefix = pathDefinition['x-controller'] ||
        controllerPrefixRegExp.exec(key)[1];

      const controllerName = `${controllerPrefix}-controller`;
      const controllerPath = path.resolve(controllersPath, controllerName);
      const ControllerClass = require(controllerPath);
      const controller = new ControllerClass();

      this.setRoutesForPath({
        controller,
        pathDefinition,
        routePath
      });
    });
  }

  /**
   * @param {Object} definition
   * @param {Object} definition.controller
   * @param {string} definition.routePath
   * @param {Object} definition.pathDefinition
   * @param {Array.<Object>} parameters
   * @private
   */
  setRoutesForPath(definition) {
    const {
      controller,
      routePath,
      pathDefinition
    } = definition;

    const {
      pathParameters = []
    } = pathDefinition;

    Object.keys(pathDefinition).forEach((verb) => {
      if (!this.router[verb]) {
        return;
      }

      const verbDefinition = pathDefinition[verb];
      const handlerPrefix = verbDefinition['x-method'] || verb;
      const handlerName = `${handlerPrefix}Action`;
      const handler = controller[handlerName];

      if (typeof handler !== 'function') {
        throw new Error(
          `${controller.constructor.name}.${handlerName}(req, res) doesn't exists`
        );
      }

      verbDefinition.parameters = (verbDefinition.parameters || [])
        .concat(pathParameters);

      this.setRoute(verb, routePath, controller, handler);
    });
  }

  /**
   * @param {string} verb The HTTP method  (eg. put, post, get, delete)
   * @param {string} path The path (eg. /pictures/{id})
   * @param {Object} controller The controller instance
   * @param {function} handler The controller function
   * @private
   */
  setRoute(method, path, controller, handler) {
    this.router[method](path, this.routeMiddleware.bind(this, controller, handler));
  }
}

module.exports = SwaggerRouter;