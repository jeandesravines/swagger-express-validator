'use strict';

const path = require('path');
const express = require('express');
const RequestRouter = require('../helper/router/request-router');
const Container = require('../helper/container/container');
const NotFoundError = require('../error/common/not-found-error');

/**
 * @class SwaggerRouter
 */
class SwaggerRouter {
  /**
   * @param {Object} options
   * @param {Object} options.swagger Swagger definition
   * @param {Object.<string, string>} options.paths The paths to the resources
   * @param {string} options.paths.controllers The paths to the controllers
   */
  constructor(options) {
    /**
     * @param {Object}
     * @private
     */
    this.swagger = options.swagger;

    /**
     * @type {Object.<string, Array.<string>>}
     * @private
     */
    this.swagger.routes = {};

    /**
     * @param {Object.<string, string>}
     * @private
     */
    this.paths = options.paths;

    /**
     * @type {Function}
     * @private
     */
    this.router = new express.Router();

    /* ******************************** */

    this.initialize();
  }

  /**
   * @private
   */
  initialize() {
    this.setDefaultRoute();
    this.setRoutes();
  }

  /**
   * @private
   */
  setDefaultRoute() {
    this.router.all('*', (req, res, next) => {
      if (!req.swagger.operation) {
        return next(new NotFoundError(req.path, req.method));
      }

      next();
    });
  }

  /**
   * @private
   */
  setRoutes() {
    const controllersPath = this.paths.controllers;
    const paths = this.swagger.paths;
    const basePath = this.swagger.basePath;

    Object.keys(paths).forEach((key) => {
      const pathDefinition = paths[key];
      const pathParameters = pathDefinition.parameters || [];

      const resourceName = /\/([^/]+)/.exec(key).pop();
      const routeName = pathDefinition['x-swagger-router-name'] || resourceName;
      const routePath = basePath + key.replace(/{(\w+)}/g, ':$1');

      const controllerPrefix = pathDefinition['x-swagger-router-controller'] || resourceName;
      const controllerName = `${controllerPrefix}-controller`;
      const ControllerClass = require(path.resolve(controllersPath, controllerName));
      const controller = new ControllerClass();

      this.setRoutesForPathDefinition({
        controller,
        pathDefinition,
        pathParameters,
        routeName,
        routePath,
      });
    });
  }

  /**
   * @param {Object} definition
   * @param {Object} definition.controller
   * @param {string} definition.routeName
   * @param {string} definition.routePath
   * @param {Object} definition.pathDefinition
   * @param {Array.<Object>} definition.pathParameters
   * @private
   */
  setRoutesForPathDefinition(definition) {
    const routes = this.swagger.routes;
    const {
      controller,
      routeName,
      routePath,
      pathDefinition,
      pathParameters,
    } = definition;

    if (!routes[routeName]) {
      routes[routeName] = {
        path: routePath,
        paths: [],
      };
    }

    routes[routeName].paths.push(pathDefinition);

    Object.keys(pathDefinition).forEach((key) => {
      if (!this.router[key]) {
        return;
      }

      const verbDefinition = pathDefinition[key];
      const methodPrefix = verbDefinition['x-swagger-router-method'] || key;
      const methodName = `${methodPrefix}Action`;
      const method = controller[methodName];

      if (typeof method !== 'function') {
        throw new Error(`${controller.constructor.name}::${methodName}(req, res) doesn't exists`);
      }

      verbDefinition.parameters = pathParameters.concat(verbDefinition.parameters || []);

      this.setRoute(key, routePath, controller, method);
    });
  }

  /**
   * @param {string} verb The HTTP method  (eg. put, post, get, delete)
   * @param {string} path The path (eg. /pictures/{id})
   * @param {Object} controller The controller instance
   * @param {function} method The controller function
   * @private
   */
  setRoute(verb, path, controller, method) {
    this.router[verb](path, (req, res, next) => {
      req.container = new Container();
      req.container.router = () => new RequestRouter(req);
      req.container.method = () => method.bind(controller);
      req.container.logger = () => req.app.locals.logger;

      next();
    });
  }
}


module.exports = SwaggerRouter;