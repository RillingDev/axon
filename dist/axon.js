var Axon = function () {
    'use strict';

    /**
     * Create a new array with the same contents
     * @param {Array} arr
     * @returns {Array}
     */

    const cloneArray = arr => Array.from(arr);

    /**
     * Checks if type is array
     * @param {Array} arr
     * @returns {Boolean}
     */
    const isArray = arr => Array.isArray(arr);

    /**
     * Flatten Array Recursively
     * @param {Array} arr
     * @returns {Array}
     */
    const flattenArray = function (arr) {
        const result = [];

        arr.forEach(item => {
            if (isArray(item)) {
                result.push(...flattenArray(item));
            } else {
                result.push(item);
            }
        });

        return result;
    };

    const isDefined = val => typeof val !== "undefined";

    /**
     *
     * @param {String} selector
     * @param {Node} [context=document]
     * @param {Boolean} [context=false]
     * @returns {Node|Array}
     */
    const query = function (selector, context = document, all = false) {
        return all ? cloneArray(context.querySelectorAll(selector)) : context.querySelector(selector);
    };

    const DOM_ATTR_PREFIX = "x-";
    const DOM_ATTR_DELIMITER = ":";

    const DOM_EVENT_MODEL = "input";

    const DOM_PROP_VALUE = "value";
    const DOM_PROP_TEXT = "textContent";
    const DOM_PROP_HTML = "innerHTML";

    /**
     * Checks if an attribute is an axon directive
     * @param {Attribute} attr
     * @returns {Boolean}
     */
    const isAttrDirective = attr => attr.name.startsWith(DOM_ATTR_PREFIX);

    /**
     * Checks if the element has any directives
     * @param {Element} element
     * @returns {Boolean}
     */
    const hasDirectives = element => cloneArray(element.attributes).some(isAttrDirective);

    /**
     * Returns directives on node
     * @param {Element} element
     * @returns {Array}
     */
    const getDirectives = function (element) {
        const attributes = cloneArray(element.attributes).filter(isAttrDirective);

        return attributes.map(attr => {
            /**
             * 'x-bind:hidden="foo"' => nameFull=["bind","hidden"] val="foo"
             */
            const nameFull = attr.name.replace(DOM_ATTR_PREFIX, "").split(DOM_ATTR_DELIMITER);
            const val = attr.value;

            return {
                val,
                name: nameFull[0],
                secondary: nameFull[1] || false
            };
        });
    };

    const directiveIgnoreBoth = () => false;

    /*import evaluateExpression from "../../controller/evaluateExpression";
    import {
        DOM_ATTR_HIDDEN
    } from "../../lib/constants";*/

    const directiveIfRender = function (node, directive, instanceContent) {
        /*const propValue = evaluateExpression(instanceContent, directive.val);
        const result = Boolean(propValue);
         if (result) {
            node.removeAttribute(DOM_ATTR_HIDDEN);
        } else {
            node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
        }
         return result;*/
        return true;
    };

    /*import bindEvent from "../../dom/bindEvent";
    import retrieveMethod from "../../controller/retrieveMethod";*/

    const directiveOnInit = function (node, directive, instanceContent) {
        /*const targetMethod = retrieveMethod(instanceContent.$methods, directive.val);
         bindEvent(node, directive.opt, targetMethod.fn, targetMethod.args, instanceContent);
         return true;*/
        return true;
    };

    //@TODO

    //import getNodeValueType from "./getNodeValueType";

    const bindEvent = function (node, eventType, eventFn) {
        return node.addEventListener(eventType, eventFn, false);
    };

    /**
     * Gets property from Axon instance
     * @private
     * @param {Object} instanceContentMethods Axon instance data container
     * @param {String} expression Directive expression
     * @returns {Mixed} property of instance
     */
    const retrieveProp = function (expression, node) {
        const splitExpression = expression.split(".");
        let result = false;
        let foundResult = false;
        let mustExit = false;
        let walker = node;
        let prop;

        while (!foundResult && !mustExit) {
            //Node-level
            let index = 0;

            console.log("ND", { walker });

            while (!foundResult && index < splitExpression.length) {
                //prop-level
                const propPath = splitExpression[index];

                console.log("PR", { walker, propPath, index });

                prop = walker.data[propPath];

                if (isDefined(prop)) {
                    if (index < splitExpression.length - 1) {
                        walker = prop;
                    } else {
                        result = {
                            val: prop,
                            ref: walker
                        };

                        console.log("RESULT", { result });

                        foundResult = true;
                    }
                }

                index++;
            }

            if (walker._parent !== false) {
                walker = walker._parent;
            } else {
                mustExit = true;
            }
        }

        console.log();

        return result;
    };

    const getNodeContentProp = function (node) {
        if (isDefined(node[DOM_PROP_VALUE])) {
            return DOM_PROP_VALUE;
        } else if (isDefined(node[DOM_PROP_TEXT])) {
            return DOM_PROP_TEXT;
        } else {
            return DOM_PROP_HTML;
        }
    };

    const directiveModelInit = function (directive, node) {
        const element = node._element;
        const elementContentProp = getNodeContentProp(element);
        const targetProp = retrieveProp(directive.val, node);

        const eventFn = function () {
            const newVal = element[elementContentProp];

            console.log(newVal);
            targetProp.ref.data[directive.val] = newVal;
            targetProp.ref.render();
        };

        bindEvent(node._element, DOM_EVENT_MODEL, eventFn);

        return true;
    };

    const directiveModelRender = function (directive, node) {
        const element = node._element;
        const elementContentProp = getNodeContentProp(element);
        const targetProp = retrieveProp(directive.val, node);

        console.log("MODEL", [directive, node], [elementContentProp, targetProp]);

        element[elementContentProp] = targetProp.val;

        return true;
    };

    //import evaluateExpression from "../../controller/evaluateExpression";

    const directiveBindRender = function (node, directive, instanceContent) {
        /*const propValue = evaluateExpression(instanceContent, directive.val);
         node.setAttribute(directive.opt, propValue);
         return true;*/
        return true;
    };

    const directives = {
        "ignore": {
            init: directiveIgnoreBoth,
            render: directiveIgnoreBoth
        },
        "if": {
            render: directiveIfRender
        },
        "on": {
            init: directiveOnInit
        },
        model: {
            init: directiveModelInit,
            render: directiveModelRender
        },
        "bind": {
            render: directiveBindRender
        }
    };

    /**
     * Axon Node
     * @class
     */
    const AxonNode = class {
        /**
         * Axon Element Node Constructor
         * @param {Element} element
         * @param {Element} _parent
         * @param {Element|true} _root
         */
        constructor(element, _parent, _root) {
            const node = this;

            const recurseSubNodes = function (child) {
                if (hasDirectives(child)) {
                    //-> Recurse
                    return new AxonNode(child, node, _root);
                } else if (child.children.length > 0) {
                    //-> Enter Children
                    return getSubNodes(child.children);
                } else {
                    //-> Exit dead-end
                    return null;
                }
            };
            const getSubNodes = children => flattenArray(cloneArray(children).map(recurseSubNodes).filter(val => val !== null));

            this.data = {}; //@TODO attach proxy

            this.directives = getDirectives(element);

            this._element = element;
            this._parent = _parent;
            this._root = _root; //is either a reference to the root or true if the node is the root
            this._children = getSubNodes(element.children); //Flatten Array as we only care about the relative position
        }
        /**
         * Runs directive over node, returns false when this node shouldnt be recursed
         * @param {"init"|"render"} type
         * @returns {Boolean}
         */
        execDirectives(type) {
            return this.directives.map(directive => {
                const directivesDictEntry = directives[directive.name];

                if (!directivesDictEntry) {
                    console.log(`directive '${directive.name}' not found`);
                    return true;
                } else {
                    if (!directivesDictEntry[type]) {
                        console.log(`directive has no type '${type}'`);
                        return true;
                    } else {
                        return directivesDictEntry[type](directive, this);
                    }
                }
            }).every(val => val !== false);
        }
        /**
         * Runs execDirectives against the node and all subnodes
         * @param {"init"|"render"} type
         */
        execDirectivesRecursive(type) {
            const result = this.execDirectives(type);

            if (result) {
                this._children.forEach(child => {
                    child.execDirectives(type);
                });
            }

            return result;
        }
        /**
         * Initializes directives
         */
        init() {
            return this.execDirectivesRecursive("init");
        }
        /**
         * Renders directives
         */
        render() {
            return this.execDirectivesRecursive("render");
        }
    };

    /**
     * Axon Root Node
     * @class
     */
    const AxonNodeRoot = class extends AxonNode {
        /**
         * Basic Axon Constructor
         * @constructor
         * @param {Object} cfg Config data for the Axon instance
         */
        constructor(cfg) {
            const element = query(cfg.el);

            super(element, false, true);

            this.data = cfg.data || {};
            this.methods = cfg.methods || {};

            this.init();
            this.render();
        }
    };

    return AxonNodeRoot;
}();