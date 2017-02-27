'use strict';

const UnknownError = require('../common/unknown-error');

/**
 * A wrong status code was returned
 * @class ResponseStatusError
 * @extends UnknownError
 */
class ResponseStatusError extends UnknownError {
  /**
   * @param {number} code The wrong status code
   * @constructor
   */
  constructor(code) {
    super({
      code,
    });
  }
}


module.exports = ResponseStatusError;
