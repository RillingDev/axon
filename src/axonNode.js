import {
    parseDirectives
} from "./dom/directive";
import {
    mapSubNodes
} from "./controller/nodes";
import {
    bindDeepDataProxy
} from "./controller/proxy";
import mapDirectives from "./directives/index";

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
     * @param {Element} $parent
     * @param {Object} data
     */
    constructor($element = null, $parent = null, data = {}) {
        const dataStorage = data;

        this.directives = parseDirectives($element);
        this.data = bindDeepDataProxy(dataStorage, this);

        this.$element = $element;
        this.$parent = $parent;
        this.$children = mapSubNodes($element.children, this);
    }
    /**
     * Runs directives on the node and all subnodes
     *
     * @param {"init"|"render"} type
     * @returns {Array|false}
     */
    run(type) {
        const runDirective = directive => {
            if (mapDirectives.has(directive.name)) {
                const mapDirectivesEntry = mapDirectives.get(directive.name);

                if (mapDirectivesEntry[type]) {
                    return mapDirectivesEntry[type](directive, this);
                }
            }

            //Ignore non-existant diretcive types
            return true;
        };

        //Recurse if all directives return true
        if (this.directives.map(runDirective).every(directiveResult => directiveResult === true)) {
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

export default AxonNode;
