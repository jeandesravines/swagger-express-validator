const HttpError = require('../../../lib').HttpError;

class NotFoundError extends HttpError {
  constructor(path) {
    super("Not found", {
      status: 404,
      details: {
        path
      }
    });
  }
}

module.exports = NotFoundError;
