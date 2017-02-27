'use strict';

const UnknownRouteError = require('../../error/router/unknown-route-error');
const RouteNotMatchError = require('../../error/router/route-not-match-error');

/**
 * @class
 */
class RequestRouter {
  /**
   * @param {Request} req
   * @param {Object.<string, Object>} routes
   * @constructor
   */
  constructor(req, routes) {
    /**
     * @type {Object.<string, Object>} routes The Swagger routes
     * @private
     */
    this.routes = routes;

    /**
     * @type {string}
     */
    this.baseUri = req.protocol + '://' + req.get('host');
  }

  /**
   * Construct an url from its route's name and parameters
   * @param {string} name The route name defined in the
   *   "x-swagger-router-name" parameter
   * @param {Object.<string, *>} [parameters]
   * @return {string} The uri
   */
  getUrl(name, parameters) {
    return this.baseUri + this.generateUrl(name, parameters);
  }

  /**
   * Construct an url from its route's name and parameters
   * @param {string} name The route name defined in the
   *   "x-swagger-router-name" parameter
   * @param {Object.<string, *>} [parameters]
   * @return {string} The uri
   */
  generateUrl(name, parameters) {
    const route = this.routes[name];

    if (!route) {
      throw new UnknownRouteError(name);
    }

    const fields = parameters ? Object.keys(parameters) : [];
    const path = this.findPath(route, fields);

    if (!path) {
      throw new RouteNotMatchError(name, parameters);
    }

    return fields.reduce((uri, key) => {
      const value = parameters[key];
      const replaced = uri.replace(new RegExp(':' + key + '\\W?'), value);

      return uri === replaced ?
        uri + (/\?/.test(uri) ? '&' : '?') + key + '=' + value :
        replaced;
    }, route.path);
  }

  /**
   * @param {Object} route
   * @param {Array.<string>} fields
   * @return {Object?}
   */
  findPath(route, fields) {
    let count = 0;
    let element = null;

    route.paths.forEach((path) => {
      Object.keys(path).forEach((verb) => {
        const definition = path[verb];

        if (!definition.parameters) {
          return;
        }

        const filtered = definition.parameters.filter((parameter) => {
          return !(parameter.required || parameter.in === 'path') ||
            fields.includes(parameter.name);
        });

        if (filtered.length > count) {
          count = filtered.length;
          element = definition;
        }
      });
    });

    return element;
  }
}


module.exports = RequestRouter;
