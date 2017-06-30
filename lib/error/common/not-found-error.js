const HttpError = require('./http-error');

/**
 * @class NotFoundError
 * @extends HttpError
 */
class NotFoundError extends HttpError {
  /**
   * @param {Object} details
   * @param {string} details.path
   * @param {string} details.method
   * @constructor
   */
  constructor(details) {
    super('Not found', {
      name: "NotFoundError",
      status: 404,
      details,
    });
  }
}

module.exports = NotFoundError;
