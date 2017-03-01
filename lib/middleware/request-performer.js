'use strict';

/**
 * @class
 * @abstract
 */
class RequestPerformer {
  /**
   * Execute operation
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static middleware(req, res, next) {
    req.app.locals.logger.debug('RequestPerformer.middleware');

    // Get the callback from the container
    req.container.method(req, res)
      .then((response) => {
        if (typeof response === 'object') {
          const keys = ['body', 'headers', 'status'];
          const isResponse = Object.keys(response)
            .every((key) => keys.includes(key));

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
