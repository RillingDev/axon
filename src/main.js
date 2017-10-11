import AxonNode from "./axonNode";

/**
 * Axon Root Node
 *
 * @class
 */
const AxonNodeRoot = class extends AxonNode {
    /**
     * Axon Root Constructor
     *
     * @constructor
     * @param {Object} cfg Config data for the Axon instance
     */
    constructor(cfg = {}) {
        super(cfg.el, null, cfg.data, cfg.methods);

        this.init();
        this.render();
    }
};

export default AxonNodeRoot;
