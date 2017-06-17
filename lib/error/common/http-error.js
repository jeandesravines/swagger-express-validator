/**
 * An HTTP error with a status code
 * @class HttpError
 * @extends Error
 * @abstract
 */
class HttpError extends Error {
  /**
   * @param {string} message - the error's data
   * @param {Object} data - the error's data
   * @param {string} data.name - the error name
   * @param {number} data.status - the HTTP status code
   * @param {Object} [data.details] - some details
   * @constructor
   * @protected
   */
  constructor(message, data) {
    super(message)

    this.details = data.details;
    this.name = data.name;
    this.status = data.status;
  }
}

module.exports = HttpError;
