const _ = require('lodash');

/**
 *
 */
class LodashDb {
  constructor() {
    /**
     * @const {Object}
     * @private
     */
    this.schema = {};
  }

  /**
   * @param {string} key
   * @return {Object}
   */
  get(options) {
    const {
      key,
      isCollection,
      offset,
      limit
    } = options;

    const value = _.get(this.schema, key);

    if (isCollection) {
      return _.values(value)
        .slice(offset, limit);
    }

    return value;
  }

  /**
   * @param {string} key
   * @param {Object} value
   * @return {Object}
   */
  set(options) {
    const {
      key,
      value
    } = options;

    return _.set(this.schema, key, value);
  }

  /**
   * @param {string} key
   * @return {Object}
   */
  unset(options) {
    const {
      key
    } = options;

    return _.unset(this.schema, key);
  }

  /**
   * @param {string} key
   * @param {Object} value
   * @return {Object}
   */
  merge(options) {
    const {
      value
    } = options;

    return _.merge(this.schema, value);
  }
}

module.exports = new LodashDb();