const uuid = require("uuid");
const db = require('../service/lodash-db');
const NotFoundError = require('../error/not-found-error');

/**
 * @abstract
 */
class Controller {
  constructor(name) {
    /**
     * @const {string}
     * @private
     */
    this.name = name;
  }

  deleteAction(req) {
    const id = req.pathParams.id;
    const key = `${this.name}.${id}`;
    const deleted = db.unset({
      key
    });

    if (!deleted) {
      throw new NotFoundError(req.path);
    }
  }

  deleteAllAction() {
    const key = this.name;

    db.unset({
      key
    });
  }

  getAction(req) {
    const id = req.pathParams.id;
    const fields = req.query.fields;
    const key = `${this.name}.${id}`;
    const body = db.get({
      fields,
      key
    });

    if (!body) {
      throw new NotFoundError(req.path);
    }

    return {
      body
    };
  }

  getAllAction(req) {
    const offset = req.query.offset;
    const limit = req.query.limit;
    const fields = req.query.fields;
    const key = this.name;
    const body = db.get({
      fields,
      key,
      limit,
      offset,
      isCollection: true
    });

    return {
      body
    }
  }

  patchAction(req) {
    const id = req.pathParams.id;
    const key = `${this.name}.${id}`;
    const value = Object.assign({}, req.body, {
      id
    });

    db.merge({
      key,
      value
    });
  }

  putAction(req) {
    const id = req.pathParams.id || uuid.v4();
    const key = `${this.name}.${id}`;
    const value = Object.assign({}, req.body, {
      id
    });

    db.set({
      key,
      value
    });

    const location = req.pathParams.id ?
      req.path :
      `${req.path}/${id}`;

    return {
      headers: {
        location
      }
    }
  }
}

module.exports = Controller;