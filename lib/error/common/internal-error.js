const HttpError = require('./http-error');

/**
 * An internal error (status: 500)
 * @class InternalError
 * @extends HttpError
 */
class InternalError extends HttpError {
  /**
   * @param {Object} details Some details
   * @constructor
   */
  constructor(details) {
    super('Internal error', {
      name: "InternalError",
      details,
      status: 500,
    });
  }
}

module.exports = InternalError;
