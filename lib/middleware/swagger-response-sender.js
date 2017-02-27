'use strict';

const logger = require('../helper/app/app').logger;

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
    logger.debug('ResponseSender.middleware', {
      response: req.response,
    });

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
