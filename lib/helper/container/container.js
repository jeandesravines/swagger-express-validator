'use strict';

/**
 * @class
 */
class Container {
  /**
   * @constructor
   */
  constructor() {
    /**
     * @type {Object.<string, function():T>}
     * @private
     */
    this.services = {};

    return new Proxy(this, {
      get: (target, name) => target.get(name),
      set: (target, name, value) => target.set(name, value),
    });
  }

  /**
   * @param {string} name
   * @return {T}
   */
  get(name) {
    const service = this.services[name];

    if (!service) {
      return undefined;
    }

    return service.instance ||
      (service.instance = service.handler());
  }

  /**
   * @param {string} name
   * @param {function():T} data
   * @return {Object.<string, function():T>}
   */
  set(name, data) {
    return (this.services[name] = {
      handler: data,
    });
  }
}


module.exports = Container;
