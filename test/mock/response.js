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
      this[key] = typeof this[key] === 'object' ?
        Object.assign(this[key], data[key]) :
        data[key];
    });
  }
}

module.exports = Response;
