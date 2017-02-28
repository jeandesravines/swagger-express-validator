'use strict';

const Ajv = require('ajv');
const ResponseStatusError = require('../error/validator/response-status-error');
const ResponseBodyError = require('../error/validator/response-body-error');
const validators = new Map();

/**
 * Middleware used for validate a response
 * @class
 * @abstract
 */
class ResponseValidator {
  /**
   * Validate the response stored in req.response.body
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @return {undefined}
   */
  static middleware(req, res, next) {
    req.app.locals.logger.debug('ResponseValidator.middleware', {
      response: req.response,
    });

    const swagger = req.swagger;
    const hash = req.method + ':' + swagger.pathName;
    const operation = swagger.operation;
    const responses = operation.responses;
    const response = req.response;
    const body = response.body;
    // Response status or default status (cf: swagger-request-handler)
    const status = response.status || operation.status;
    const statusResponse = responses[status];

    if (!statusResponse) {
      throw new ResponseStatusError(status);
    }

    if (statusResponse.schema) {
      let validate = validators.get(hash);

      if (!validate) {
        validate = new Ajv({
          coerceTypes: true,
        }).compile(statusResponse.schema);

        validators.set(hash, validate);
      }

      if (validate(body) === false) {
        return next(new ResponseBodyError(validate.errors[0], body));
      }
    }

    if (!response.status) {
      response.status = status;
    }

    next();
  }
}


module.exports = ResponseValidator.middleware;
