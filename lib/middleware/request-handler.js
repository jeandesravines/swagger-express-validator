'use strict';

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
   */
  static middleware(req, res, next) {
    req.app.locals.logger.debug('Requesthandler.middleware', {
      request: {
        method: req.method,
      },
    });

    const operation = req.swagger.operation;
    const responses = operation.responses;
    // Get the default status
    const status = Object.keys(responses).sort().pop();

    operation.status = status;

    // If query has fields,
    // Add all required fields to the query
    if (req.query.fields) {
      const schema = responses[status].schema || {};
      const requiredFields = schema.items && schema.items.required ||
        schema.required;

      if (requiredFields) {
        requiredFields.forEach((field) => {
          if (!req.query.fields.includes(field)) {
            req.query.fields.push(field);
          }
        });
      }
    }

    next();
  }
}


module.exports = Requesthandler.middleware;
