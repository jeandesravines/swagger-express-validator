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
    const id = req.params.contactId;
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
    const id = req.params.contactId;
    const key = `${this.name}.${id}`;
    const value = db.get({
      key
    });
    
    if (!value) {
      throw new NotFoundError(req.path);
    }
    
    return value;
  }

  getAllAction(req) {
    const offset = req.query.offset;
    const limit = req.query.limit;
    const key = this.name;

    return db.get({
      key,
      limit,
      offset,
      isCollection: true
    });
  }

  patchAction(req) {
    const id = req.params.contactId;
    const key = `${this.name}.${id}`;
    const body = Object.assign({}, req.body, {
      id
    });

    db.merge({
      value: {
        [key]: body
      }
    });
  }

  putAction(req) {
    const id = req.params.contactId || uuid.v4();
    const key = `${this.name}.${id}`;
    const body = Object.assign({}, req.body, {
      id
    });

    db.set({
      key,
      value: body
    });
  }
}

module.exports = Controller;