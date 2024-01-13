const BidChecker = require("./bid-checker.class");

class BidsPool {
  /**
   * @typedef {Object.<string, BidChecker>} InstancesRecord
   * @description A record of instances where keys are IDs and values are instances of BidChecker.
   */

  /**
   * @type {InstancesRecord}
   */
  instances = {};

  /**
   * @type {BidsPool}
   */
  static #instance = null;

  constructor() {
    if (!BidsPool.#instance) {
      BidsPool.#instance = this;
    }
    return BidsPool.#instance;
  }

  static getInstance() {
    if (!BidsPool.#instance) {
      BidsPool.#instance = new BidsPool();
    }
    return BidsPool.#instance;
  }

  createOrGetInstance(id) {
    if (!this.instances[id]) {
      this.instances[id] = new BidChecker(this);
    }
    return this.instances[id];
  }

  deleteInstance(id) {
    if (this.instances[id]) {
      const instanceToDelete = this.instances[id];

      instanceToDelete.cleanup(() => {
        delete this.instances[id];
      });
    }
  }
}
module.exports = BidsPool.getInstance();
