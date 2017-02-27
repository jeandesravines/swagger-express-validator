'use strict';

const InternalError = require('../common/internal-error');

/**
 * @class RouteNotMatchError
 * @extends InternalError
 */
class RouteNotMatchError extends InternalError {
  /**
   * @param {string} route The wrong route name
   * @param {Object.<string, string>} parameters
   * @constructor
   */
  constructor(route, parameters) {
    super({
      route,
      parameters,
    });
  }
}


module.exports = RouteNotMatchError;
