import {
    arrFrom,
    arrFlattenDeep
} from "lightdash";
import {
    hasDirectives,
    parseDirectives
} from "../dom/directive";
import {
    bindDeepDataProxy
} from "./proxy";
import mapDirectives from "../directives/index";

/**
 * Gets the topmost node
 *
 * @private
 * @param {AxonNode} node
 * @returns {AxonNode}
 */
const getNodeRoot = node => {
    let result = node;

    while (result.$parent !== null) {
        result = result.$parent;
    }

    return result;
};

/**
 * Maps and processes Array of element children
 *
 * @private
 * @param {NodeList} children
 * @param {AxonNode} node
 * @returns {Array<Object>}
 */
const mapSubNodes = (children, node) => arrFlattenDeep(arrFrom(children)
    .map(child => {
        if (hasDirectives(child)) {
            //-> Recurse
            return new AxonNode(child, node);
        } else if (child.children.length > 0) {
            //-> Enter Children
            return mapSubNodes(child.children, node);
        } else {
            //-> Exit dead-end
            return null;
        }
    })
    .filter(val => val !== null));

/**
 * Axon Node
 *
 * @class
 */
const AxonNode = class {
    /**
     * Axon Element Node Constructor
     *
     * @constructor
     * @param {Element} $element
     * @param {Element|null} $parent
     * @param {Object} [data={}]
     */
    constructor($element, $parent, data = {}) {
        const dataStorage = data;

        this.directives = parseDirectives($element);
        this.data = bindDeepDataProxy(dataStorage, this);

        this.$element = $element;
        this.$parent = $parent;
        this.$children = mapSubNodes($element.children, this);
    }
    /**
     * Runs directives on the node and all sub-nodes
     *
     * @param {"init"|"render"} type
     * @returns {Array|false}
     */
    run(type) {
        const directiveResults = this.directives
            .map(directive => {
                if (mapDirectives.has(directive.name)) {
                    const mapDirectivesEntry = mapDirectives.get(directive.name);

                    if (mapDirectivesEntry[type]) {
                        return mapDirectivesEntry[type](directive, this);
                    }
                }

                //Ignore non-existent directive types
                return true;
            });

        //Recurse if all directives return true
        if (directiveResults.every(directiveResult => directiveResult === true)) {
            return this.$children.map(child => child.run(type));
        } else {
            return false;
        }
    }
    /**
     * Initializes directives
     */
    init() {
        return this.run("init");
    }
    /**
     * Renders directives
     */
    render() {
        return this.run("render");
    }
};

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
     * @param {Object} [cfg={}] Config data for the Axon instance
     */
    constructor(cfg = {}) {
        super(cfg.el, null, cfg.data);

        this.methods = cfg.methods || {};

        this.init();
        this.render();
    }
};

export {
    mapSubNodes,
    getNodeRoot,

    AxonNode,
    AxonNodeRoot
};
