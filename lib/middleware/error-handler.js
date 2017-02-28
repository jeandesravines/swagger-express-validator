'use strict';

const configuration = require('../configuration/configuration');

/**
 * @class
 * @abstract
 */
class ErrorHandler {
  /**
   *
   * @param {Error} err
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @return {undefined}
   */
  static middleware(err, req, res, next) {
    req.app.locals.logger.error('ErrorHandler.middleware', {
      error: err,
      request: {
        method: req.method,
        path: req.path,
      },
    });

    if (res.headersSent) {
      return next(err);
    }

    const development = configuration.environment !== 'production';
    const status = err.status || 500;
    const response = {
      message: err.message,
    };

    if (err.stack && development) {
      response.stack = err.stack.split('\n')
        .slice(1)
        .map((row) => row.replace(/^\s*at /, ''));
    }

    if (status < 500 || development) {
      response.details = err.details;
      response.name = err.name;
    }

    res.status(status)
      .send(response);
  }
}


module.exports = ErrorHandler.middleware;
