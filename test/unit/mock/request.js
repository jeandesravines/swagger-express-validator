/**
 * @class Request
 */
class Request {
  /**
   * @construct
   * @param {Object} [data]
   */
  constructor(data = {}) {
    this.container = {
      logger: {
        debug: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
        error: jest.fn()
      }
    };

    this.app = {
      locals: {
        logger: this.container.logger
      }
    };

    this.query = {};

    //////////////////////////////////////////////

    Object.keys(data).forEach((key) => {
      this[key] = typeof this[key] === 'object' ?
        Object.assign(this[key], data[key]) :
        data[key];
    });
  }
}

module.exports = Request;