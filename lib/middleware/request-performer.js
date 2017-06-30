const Middleware = require("./middleware");

/**
 * @class
 * @abstract
 */
class RequestPerformer extends Middleware {
  /**
   * Execute operation
   * @param {Request} req
   * @param {Object} req.container
   * @param {Function} req.container.handler
   * @param {Response} res
   * @return {Promise}
   */
  static handler(req, res) {
    req.container.logger.debug("RequestPerformer.middleware");

    // Get the callback from the container
    return Promise.resolve()
      .then(() => req.container.handler(req, res))
      .then((response) => {
        if (response && typeof response === "object" && !Array.isArray(response)) {
          const keys = Object.keys(response);
          const required = ["body", "headers", "status"];
          const isResponse = keys.length <= required.length &&
            keys.every((key) => required.indexOf(key) >= 0);

          if (isResponse) {
            req.response = response;
          }
        }

        if (!req.response) {
          req.response = {
            body: response,
          };
        }
      });
  }
}

module.exports = RequestPerformer;