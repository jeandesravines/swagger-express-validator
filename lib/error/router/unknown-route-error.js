'use strict';

const InternalError = require('../common/internal-error');

/**
 * @class UnknownRouteError
 * @extends InternalError
 */
class UnknownRouteError extends InternalError {
  /**
   * @param {string} route The wrong route name
   * @constructor
   */
  constructor(route) {
    super({
      route,
    });
  }
}

module.exports = UnknownRouteError;
