import AxonNode from "./axonNode";

/**
 * Axon Root Node
 *
 * @class
 */
const AxonNodeRoot = class extends AxonNode {
    /**
     * Basic Axon Constructor
     *
     * @constructor
     * @param {Object} cfg Config data for the Axon instance
     */
    constructor(cfg = {}) {
        const node = super(cfg.el, null, cfg.data, true);

        /**
         * node[0] is the direct node access
         * node[1] is the proxied access
         */
        node[0].methods = cfg.methods || {};

        node[0].init();
        node[0].render();

        return node[1];
    }
};

export default AxonNodeRoot;
