const Ajv = require('ajv');
const Middleware = require('./middleware');
const ResponseStatusError = require('../error/validator/response-status-error');
const ResponseBodyError = require('../error/validator/response-body-error');

const validators = new Map();
const ajv = new Ajv({
  coerceTypes: true
});

/**
 * Middleware used for validate a response
 * @class
 * @abstract
 */
class ResponseValidator extends Middleware {
  /**
   * @return {Map.<function>}
   */
  static get validators() {
    return validators;
  }

  /**
   * Validate the response stored in req.response.body
   * @param {Request} req
   */
  static handler(req) {
    const response = req.response;
    const body = response.body;

    req.container.logger.debug('ResponseValidator.middleware', {
      response: {
        status: response.status,
        headers: response.headers,
        body: body && {
          keys: Object.keys(body),
          preview: JSON.stringify(body)
            .substring(0, 140),
        },
      },
    });

    const swagger = req.swagger;
    const hash = `${req.method}:${swagger.pathName}`;
    const operation = swagger.operation;
    const responses = operation.responses;
    // Response status or default status (cf: request-handler)
    const status = response.status || operation.status;
    const statusResponse = responses[status];

    if (!statusResponse) {
      throw new ResponseStatusError(status);
    }

    if (statusResponse.schema) {
      let validate = validators.get(hash);

      if (!validate) {
        validate = ajv.compile(statusResponse.schema);
        validators.set(hash, validate);
      }

      if (!validate(body)) {
        throw new ResponseBodyError(validate.errors[0], body);
      }
    }

    if (!response.status) {
      response.status = status;
    }
  }
}

module.exports = ResponseValidator;