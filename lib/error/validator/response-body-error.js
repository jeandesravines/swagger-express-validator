'use strict';

const InternalError = require('../common/internal-error');

/**
 * A ResponseBodyError
 * @class ResponseBodyError
 * @extends InternalError
 */
class ResponseBodyError extends InternalError {
  /**
   * @param {Object} details
   * @param {*} body
   * @constructor
   */
  constructor(details, body) {
    super(Object.assign(details, {
      body,
    }));
  }
}

module.exports = ResponseBodyError;
