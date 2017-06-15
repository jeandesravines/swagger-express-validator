/**
 * An HTTP error with a status code
 * @class HttpError
 * @extends Error
 * @abstract
 */
class HttpError extends Error {
  /**
   * @param {string} message The error's data
   * @param {Object} data The error's data
   * @param {number} data.status The HTTP status code
   * @param {Object} data.details Some details
   * @constructor
   * @protected
   */
  constructor(message, data) {
    super(message);

    this.details = data.details;
    this.name = this.constructor.name;
    this.status = data.status;
  }
}

module.exports = HttpError;
