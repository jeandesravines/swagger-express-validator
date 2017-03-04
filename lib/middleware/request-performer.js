'use strict';

/**
 * @class
 * @abstract
 */
class RequestPerformer {
  /**
   * Execute operation
   * @param {Request} req
   * @param {Container} req.container
   * @param {Function} req.container.handler
   * @param {Response} res
   * @param {Function} next
   */
  static middleware(req, res, next) {
    req.app.locals.logger.debug('RequestPerformer.middleware');

    // Get the callback from the container
    Promise.resolve()
      .then(() => req.container.handler(req, res))
      .then((response) => {
        if (response && typeof response === 'object' && !Array.isArray(response)) {
          const keys = Object.keys(response);
          const required = ['body', 'status'];
          const isResponse = keys.length > 0 &&
            keys.every((key) => required.includes(key));

          if (isResponse) {
            req.response = response;
          }
        }

        if (!req.response) {
          req.response = {
            body: response,
          };
        }
      })
      .then(next, next);
  }
}


module.exports = RequestPerformer.middleware;
