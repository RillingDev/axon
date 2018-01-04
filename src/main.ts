import { AxonNode } from "./vdom/node";
import { IAxonNode, IAxonNodeRoot, IAxonDirective, IAxonConfig } from "./interfaces";

/**
 * Axon Root Node
 *
 * @class
 */
const AxonNodeRoot = class extends AxonNode implements IAxonNodeRoot {
    public methods: object;
    /**
     * Axon Root Constructor
     *
     * @constructor
     * @param {Object} [cfg={}] Config data for the Axon instance
     */
    constructor(cfg: IAxonConfig) {
        super(cfg.el, null, cfg.data);

        this.methods = cfg.methods || {};

        this.init();
        this.render();
    }
};

export default AxonNodeRoot;
