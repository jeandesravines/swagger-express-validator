/**
 * @class Response
 */
class Response {
  /**
   * @construct
   * @param {Object} data
   */
  constructor(data = {}) {
    this.set = jest.fn().mockReturnThis();
    this.send = jest.fn().mockReturnThis();
    this.status = jest.fn().mockReturnThis();
    this.headersSent = false;

    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }
}

module.exports = Response;
