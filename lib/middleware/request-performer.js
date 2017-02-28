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
        req.response = response ||  {};
      })
      .then(next, next);
  }
}


module.exports = RequestPerformer.middleware;
