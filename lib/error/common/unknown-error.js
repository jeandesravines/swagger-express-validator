'use strict';

const HttpError = require('./http-error');

/**
 * An unknown error (status: 520)
 * @class UnknownError
 * @extends HttpError
 */
class UnknownError extends HttpError {
  /**
   * @param {Object} details Some details
   * @constructor
   */
  constructor(details) {
    super('Unknown error', {
      details,
      status: 520,
    });
  }
}


module.exports = UnknownError;
