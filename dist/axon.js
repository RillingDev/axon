var Axon = function () {
    'use strict';

    const DOM_EVENT_TIMEOUT = 20; //event timeout in ms
    const DOM_EVENT_MODEL = "input";

    const DOM_ATTR_PREFIX = "x-";
    const DOM_ATTR_HIDDEN = "hidden";
    const DOM_ATTR_VALUE = "value";
    const DOM_ATTR_TEXT = "textContent";
    const DOM_ATTR_HTML = "innerHTML";

    const LIB_STRING_QUOTES = ["'", "\"", "`"];

    const getDirectives = function (node) {
        const attrArr = Array.from(node.attributes);
        const result = [];

        attrArr.forEach(attr => {
            //If is Axon attribute
            if (attr.name.substr(0, DOM_ATTR_PREFIX.length) === DOM_ATTR_PREFIX) {
                const splitName = attr.name.replace(DOM_ATTR_PREFIX, "").split(":");

                result.push({
                    key: splitName[0],
                    opt: splitName[1] || false,
                    val: attr.value
                });
            }
        });

        return result;
    };

    /**
     * @private
     * @param {Mixed} val Value to check
     * @returns {Boolean} if the value is defined
     */
    const isDefined = function (val) {
        return typeof val !== "undefined";
    };

    const getDomMap = function (entry) {
        const recurseNodes = function (node) {
            const nodeDirectives = getDirectives(node);
            const nodeChildren = node.children;

            if (nodeDirectives.length || nodeChildren.length) {
                let result = {
                    node,
                    directives: nodeDirectives,
                    children: []
                };
                const childArr = Array.from(nodeChildren);

                childArr.forEach(childNode => {
                    const childResult = recurseNodes(childNode);

                    if (isDefined(childResult)) {
                        result.children.push(childResult);
                    }
                });

                return result;
            }
        };

        return recurseNodes(entry);
    };

    const directiveIgnoreBoth = function () {
        return false;
    };

    /**
     * Gets method from Axon instance
     * @private
     * @param {Axon} instance Axon instance
     * @param {String} expression Directive expression
     * @returns {Function} method of instance
     */
    const retrieveMethod = function (instance, expression) {
        const expressionSplit = expression.substr(0, expression.length - 1).split("(");
        const methodName = expressionSplit[0];
        const methodArgs = expressionSplit[1].split(",").filter(item => item !== "").map(arg => {
            return evaluateExpression(instance, arg);
        });
        const methodFn = instance.$methods[methodName];

        if (typeof methodFn === "function") {
            return {
                fn: methodFn,
                args: methodArgs
            };
        } else {
            throw new Error(`Missing method '${expression}'`);
        }
    };

    /**
     * Gets property from Axon instance
     * @private
     * @param {Axon} instance Axon instance
     * @param {String} expression Directive expression
     * @returns {Mixed} property of instance
     */
    const retrieveProp = function (instance, expression) {
        const splitExpression = expression.split(".");
        const result = {
            val: null,
            ref: null
        };
        let container = instance.$data;
        let prop;

        splitExpression.forEach((propPath, index) => {
            prop = container[propPath];

            if (isDefined(prop)) {

                if (index < splitExpression.length - 1) {
                    container = prop;
                } else {
                    result.val = prop;
                    result.ref = container;
                }
            } else {
                throw new Error(`Missing prop '${expression}'`);
            }
        });

        return result;
    };

    /**
     * evaluates expression from Axon instance
     * @private
     * @param {Axon} instance Axon instance
     * @param {String} expression Directive expression
     * @returns {Mixed} value of expression
     */
    const evaluateExpression = function (instance, expression) {

        if (!isNaN(Number(expression))) {
            //expression is a Number
            return Number(expression);
        } else if (LIB_STRING_QUOTES.includes(expression.substr(0, 1))) {
            //expression is a String
            return expression.substr(1, expression.length - 2);
        } else if (expression.substr(expression.length - 1) === ")") {
            //expression is a Method
            const method = retrieveMethod(instance, expression);

            return method.fn.apply(instance, method.args);
        } else {
            //expression is a Property
            return retrieveProp(instance, expression).val;
        }
    };

    const directiveIfRender = function (instance, node, directive) {
        const propValue = evaluateExpression(instance, directive.val);
        const result = Boolean(propValue);

        if (result) {
            node.removeAttribute(DOM_ATTR_HIDDEN);
        } else {
            node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
        }

        return result;
    };

    /**
     * @private
     * @param {Function} fn function to debounce
     * @param {Number} wait timeout in ms
     * @param {Boolean} immediate if the debounc should be ignored
     * @returns {Function} debounced function
     */
    const debounce = function (fn, wait, immediate) {
        let timeout;

        return function () {
            const context = this;
            const args = Array.from(arguments);
            const callNow = immediate && !timeout;
            const later = function () {
                timeout = null;
                if (!immediate) {
                    fn.apply(context, args);
                }
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                fn.apply(context, args);
            }
        };
    };

    const getNodeValueType = function (node) {
        if (isDefined(node[DOM_ATTR_VALUE])) {
            return DOM_ATTR_VALUE;
        } else if (isDefined(node[DOM_ATTR_TEXT])) {
            return DOM_ATTR_TEXT;
        } else {
            return DOM_ATTR_HTML;
        }
    };

    const bindEvent = function (node, eventType, eventFn, eventArgs, instance) {
        const debouncedFn = debounce(eventFn, DOM_EVENT_TIMEOUT);
        const nodeValueType = getNodeValueType(node);

        const eventFnWrapper = function (event) {
            const target = event.target;
            const args = Array.from(eventArgs);

            args.push(target[nodeValueType], target, event);

            return debouncedFn.apply(instance, args);
        };

        return node.addEventListener(eventType, eventFnWrapper, false);
    };

    const directiveOnInit = function (instance, node, directive) {
        const targetMethod = retrieveMethod(instance, directive.val);

        bindEvent(node, directive.opt, targetMethod.fn, targetMethod.args, instance);

        return true;
    };

    const directiveModelInit = function (instance, node, directive) {
        const targetProp = retrieveProp(instance, directive.val);
        const eventFn = function (currentValue, newValue) {
            targetProp.ref[directive.val] = newValue;

            setTimeout(() => {
                instance.$render();
            }, DOM_EVENT_TIMEOUT);
        };

        bindEvent(node, DOM_EVENT_MODEL, eventFn, [targetProp.val], instance);

        return true;
    };

    const directiveModelRender = function (instance, node, directive) {
        const nodeValueType = getNodeValueType(node);
        const propValue = retrieveProp(instance, directive.val);

        node[nodeValueType] = propValue.val;

        return true;
    };

    const directiveBindRender = function (instance, node, directive) {
        const propValue = evaluateExpression(instance, directive.val);

        node.setAttribute(directive.opt, propValue);

        return true;
    };

    /*import {
        directiveForInit,
        directiveForRender
    } from "./modules/directiveFor";*/

    const directives = {
        ignore: {
            init: directiveIgnoreBoth, //Init function
            render: directiveIgnoreBoth //Render function
        },
        if: {
            render: directiveIfRender
        },
        on: {
            init: directiveOnInit
        },
        model: {
            init: directiveModelInit,
            render: directiveModelRender
        },
        bind: {
            render: directiveBindRender
        }
    };

    /**
     * Runs all directives from the domMap
     * @private
     * @param {Axon} instance Axon instance
     * @param {Object} domMap domMap to run directives
     * @param {String} execMode mode to run in ("init" or "render")
     */
    const execDirectives = function (instance, domMap, execMode) {
        const recurseMap = function (mapNode) {
            const nodeChildren = mapNode.children;
            const nodeDirectives = mapNode.directives;
            let result = true;

            //Exec on node
            if (nodeDirectives.length) {
                //Only exec if directives on domNode
                mapNode.directives.forEach(directive => {
                    const directiveRef = directives[directive.key];

                    if (directiveRef) {
                        //Only exec if directive exists
                        const directiveRefFn = directiveRef[execMode];

                        if (directiveRefFn) {
                            //Only exec if directive has fn for current execMode
                            const directiveResult = directiveRefFn(instance, mapNode.node, directive);

                            if (!directiveResult) {
                                //Stop crawling on directive return 'false'
                                result = false;
                            }
                        }
                    }
                });
            }

            //Crawl children
            if (result && nodeChildren.length) {
                nodeChildren.forEach(child => {
                    recurseMap(child);
                });
            }
        };

        recurseMap(domMap);
    };

    /**
     * Axon Class
     * @class
     */
    const Axon = class {
        /**
         * Basic Axon Constructor
         * @constructor
         * @param {Object} config Config data for the Axon instance
         * @returns {Axon} Returns Axon instance
         */
        constructor(config) {
            const _this = this;

            _this.$context = document.querySelector(config.context);
            _this.$data = config.data;
            _this.$methods = config.methods;
            _this.$cache = {};

            _this.$init();

            return _this;
        }
        /**
         * Init directives
         */
        $init() {
            const _this = this;

            _this.$cache = getDomMap(_this.$context);
            execDirectives(_this, _this.$cache, "init");
        }
        /**
         * Renders controller changes
         */
        $render() {
            const _this = this;

            execDirectives(_this, _this.$cache, "render");
        }
    };

    return Axon;
}();