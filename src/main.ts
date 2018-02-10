import mapDirectives from "./directives/index";
import { EDirectiveFn } from "./enums";
import {
    IAxonApp,
    IAxonConfig,
    IAxonDirectiveDeclaration,
    IAxonNode
} from "./interfaces";
import { AxonNode } from "./vdom/node";

/**
 * Axon Root Node
 *
 * @class
 */
const AxonApp = class implements IAxonApp {
    public $entry: IAxonNode;

    public methods: object;

    public directives: Map<string, IAxonDirectiveDeclaration>;
    /**
     * Axon Root Constructor
     *
     * @constructor
     * @param {Object} [cfg={}] Config data for the Axon instance
     */
    constructor(cfg: IAxonConfig) {
        this.$entry = new AxonNode(this, cfg.el, null, cfg.data);

        this.methods = cfg.methods || {};

        this.directives = mapDirectives;

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
