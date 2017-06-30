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
      fields,
      key,
      isCollection,
      offset,
      limit,
      filter = {}
    } = options;

    const value = _.get(this.schema, key);

    if (isCollection) {
      const values = _.chain(value)
        .filter(filter)
        .slice(offset, limit)
        .value();

      return this.filter(values, fields);
    }

    return this.filter(value, fields);
  }
    
  /**
   * @param {Array.<Object>|Object} value
   * @param {Array.<string>} [fields]
   * @return {Array|Object}
   */
  filter(value, fields) {
    if (!fields) {
      return value;
    }
    
    if (Array.isArray(value)) {
      return value.map((value) => _.pick(value, fields));
    }
    
    return _.pick(value, fields);
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
   * @return {Object} - the merged object
   */
  merge(options) {
    const {
      key,
      value
    } = options;
    
    return _.chain(this.schema)
      .get(key)
      .merge(value)
      .value();
  }
}

module.exports = new LodashDb();