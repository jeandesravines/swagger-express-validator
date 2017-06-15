const Middleware = require('./middleware');

/**
 * @class
 * @abstract
 */
class ResponseSender extends Middleware {
  /**
   * Send the response stored in req.response
   * @param {express.Request} req
   * @param {Response} req.response
   * @param {*} [req.response.body]
   * @param {express.Response} res
   */
  static handler(req, res) {
    req.container.logger.debug('ResponseSender.middleware');

    const {
      status = 200,
      headers,
      body,
    } = req.response;

    res.status(status)
      .set(headers)
      .send(body);
  }
}

module.exports = ResponseSender;
