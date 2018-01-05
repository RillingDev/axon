import { AxonNode } from "./vdom/node";
import { IAxonNode, IAxonApp, IAxonConfig } from "./interfaces";
import {
    EDirectiveFn
} from "./enums";

/**
 * Axon Root Node
 *
 * @class
 */
const AxonApp = class implements IAxonApp {
    public $entry: IAxonNode;

    public methods: object;
    public computed: object;
    /**
     * Axon Root Constructor
     *
     * @constructor
     * @param {Object} [cfg={}] Config data for the Axon instance
     */
    constructor(cfg: IAxonConfig) {
        this.$entry = new AxonNode(this, cfg.el, null, cfg.data);

        this.methods = cfg.methods || {};
        this.computed = cfg.computed || {};

        this.init();
        this.render();
    }
    /**
     * Initializes directives
     */
    public init() {
        return this.$entry.run(EDirectiveFn.init);
    }
    /**
     * Renders directives
     */
    public render() {
        return this.$entry.run(EDirectiveFn.render);
    }
};

export default AxonApp;
