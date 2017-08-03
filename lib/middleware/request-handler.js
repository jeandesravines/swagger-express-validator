const Middleware = require('./middleware');

/**
 * @class
 * @abstract
 */
class Requesthandler extends Middleware {
  /**
   * handle the request to prepare it
   * @param {Request} req
   * @param {Response} res
   */
  static handler(req) {
    req.container.logger.debug('RequestHandler.middleware', {
      request: {
        method: req.method,
      },
    });

    const operation = req.swagger.operation;
    const responses = operation.responses;
    const status = Object.keys(responses)[0];
    const schema = responses[status].schema;
    const queryFields = req.query.fields;

    operation.status = status;

    // If query has fields,
    // Add all required fields to the query
    if (schema && queryFields && queryFields.length) {
      const requiredFields = [].concat(
        schema.items && schema.items.required || [],
        schema.required || []
      );

      if (requiredFields.length) {
        requiredFields.forEach((field) => {
          if (!queryFields.includes(field)) {
            queryFields.push(field);
          }
        });
      }
    }
  }
}

module.exports = Requesthandler;
