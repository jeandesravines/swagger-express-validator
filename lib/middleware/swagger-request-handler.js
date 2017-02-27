'use strict';

const logger = require('../helper/app/app').logger;

/**
 * @class
 * @abstract
 */
class Requesthandler {
  /**
   * handle the request to prepare it
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @return {undefined}
   */
  static middleware(req, res, next) {
    logger.debug('Requesthandler.middleware', {
      request: {
        method: req.method,
      },
    });

    const method = req.container.method;
    const operation = req.swagger.operation;
    const responses = req.swagger.operation.responses;
    const status = Object.keys(responses).pop();
    const schema = responses[status].schema;
    const fields = schema.items && schema.items.required || schema.required;

    operation.status = status;

    console.log(fields);

    if (fields) {
      // req.query.fields =
    }

    method(req, res)
      .then((response) => {
        req.response = response;
      });
      // .then(next, next);
  }
}


module.exports = Requesthandler.middleware;
