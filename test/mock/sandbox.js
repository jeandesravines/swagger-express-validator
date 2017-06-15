/**
 * @class Sandbox
 */
class Sandbox {
  /**
   * @constructor
   */
  constructor() {
    /**
     * @const {Array.<Function>}
     */
    this.spies = [];
  }

  /**
   * Create a mock
   * @param {Object} target - an object
   * @param {string} property - the property of the target
   * @return {Function} - the mocked function
   */
  spyOn(target, property) {
    if (!target[property]) {
      target[property] = () => void 0;
    }

    return (this.spies[this.spies.length] = jest.spyOn(target, property));
  }

  /**
   * Restore all mocks
   */
  restoreAllMocks() {
    this.spies.forEach((spy) => spy.mockRestore());
    this.spies.splice(0);
  }

  /**
   * Create a sandbox
   * @return {Sandbox} - a sandbox
   */
  static create() {
    return new Sandbox();
  }
}

module.exports = Sandbox;