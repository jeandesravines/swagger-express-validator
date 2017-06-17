const InternalError = require('../common/internal-error');

/**
 * A wrong status code was returned
 * @class ResponseStatusError
 * @extends InternalError
 */
class ResponseStatusError extends InternalError {
  /**
   * @param {number} status The wrong status code
   * @constructor
   */
  constructor(status) {
    super({
      status,
    });
  }
}

module.exports = ResponseStatusError;