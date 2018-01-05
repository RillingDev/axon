import { AxonNode } from "./vdom/node";
import { IAxonNode, IAxonNodeRoot, IAxonDirective, IAxonConfig } from "./interfaces";
import {
    DIRECTIVE_KEY_INIT,
    DIRECTIVE_KEY_RENDER
} from "./constants";

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
    /**
     * Initializes directives
     */
    public init() {
        return this.run(DIRECTIVE_KEY_INIT);
    }
    /**
     * Renders directives
     */
    public render() {
        return this.run(DIRECTIVE_KEY_RENDER);
    }
};

export default AxonNodeRoot;
