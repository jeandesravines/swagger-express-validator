const configuration = require('../configuration/configuration');
const Middleware = require('./middleware');

/**
 * @class
 * @abstract
 */
class ErrorHandler extends Middleware {
  /**
   * @static
   * @param {Error} err
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {function} next
   * @return {Promise}
   */
  static middleware(err, req, res, next) {
    return Middleware.error(req, req, res, next);
  }
  
  /**
   *
   * @param {Error} err
   * @param {Request} req
   * @param {Response} res
   * @return {undefined}
   */
  static handler(err, req, res) {
    req.container.logger.error('ErrorHandler.middleware', {
      error: err.message,
      request: {
        method: req.method,
        path: req.path,
      },
    });

    if (res.headersSent) {
      throw err;
    }

    const development = configuration.development;
    const status = err.status || 500;
    const response = {
      message: err.message,
    };

    if (development && err.stack) {
      response.stack = err.stack.split('\n')
        .slice(1)
        .map((row) => row.replace(/^\s*at /, ''));
    }

    if (development || status < 500) {
      response.details = err.details;
      response.name = err.name;
    }

    res.status(status)
      .send(response);
  }
}

module.exports = ErrorHandler;
