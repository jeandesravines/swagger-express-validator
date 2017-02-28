'use strict';

/**
 * @class
 * @abstract
 */
class ResponseSender {
  /**
   * Send the response stored in req.response
   * @param {express.Request} req
   * @param {Response} req.response
   * @param {*} [req.response.body]
   * @param {express.Response} res
   * @param {Function} next
   * @return {undefined}
   */
  static middleware(req, res, next) {
    req.app.locals.logger.debug('ResponseSender.middleware');

    const {
      status,
      headers,
      body,
    } = req.response;

    res.status(status || 200)
      .set(headers)
      .send(body);
  }
}


module.exports = ResponseSender.middleware;
