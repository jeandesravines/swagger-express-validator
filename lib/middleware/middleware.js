/**
 * @abstract
 * @class Middleware
 */
class Middleware {
  /**
   * @static
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {function} next
   * @return {Promise}
   */
  static middleware(req, res, next) {
    return Promise.resolve()
      .then(() => this.handler(req, res))
      .then(() => next())
      .catch((error) => next(error));
  }

  /**
   * @static
   * @param {Error} err
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {function} next
   * @return {Promise}
   */
  static error(err, req, res, next) {
    return Promise.resolve()
      .then(() => this.handler(err, req, res))
      .then(() => next())
      .catch((error) => next(error));
  }
  
  /**
   * @abstract
   */
  static handler() {
    throw new Error('Not set yet!');
  }
}

module.exports = Middleware;