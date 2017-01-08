/**
 * Axon v0.12.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

var Axon = (function () {
'use strict';

var mapNodes = function mapNodes(entry, fn) {
    var result = {};
    var recurseNodes = function recurseNodes(node, depth, container) {
        container.node = node;
        container.children = [];
        fn(container, node, depth);

        if (node.childElementCount) {
            var childArr = Array.from(node.children);

            childArr.forEach(function (childNode, index) {
                container.children[index] = {};

                recurseNodes(childNode, depth + 1, container.children[index]);
            });
        }
    };

    recurseNodes(entry, 0, result);

    return result;
};

var DOM_EVENT_TIMEOUT = 20; //event timeout in ms
var DOM_EVENT_MODEL = "input";

var DOM_ATTR_PREFIX = "x-";
var DOM_ATTR_HIDDEN = "hidden";
var DOM_ATTR_VALUE = "value";
var DOM_ATTR_TEXT = "textContent";
var DOM_ATTR_HTML = "innerHTML";

var LIB_STRING_QUOTES = ["'", "\"", "`"];

var getDirectives = function getDirectives(node) {
    var attrArr = Array.from(node.attributes);
    var result = [];

    attrArr.forEach(function (attr) {
        //If is Axon attribute
        if (attr.name.substr(0, DOM_ATTR_PREFIX.length) === DOM_ATTR_PREFIX) {
            var splitName = attr.name.replace(DOM_ATTR_PREFIX, "").split(":");

            result.push({
                key: splitName[0],
                opt: splitName[1] || false,
                val: attr.value
            });
        }
    });

    return result;
};

var directiveIgnoreBoth = function directiveIgnoreBoth() {
    return false;
};

var retrieveMethod = function retrieveMethod(instance, expression) {
    var expressionSplit = expression.substr(0, expression.length - 1).split("(");
    var methodName = expressionSplit[0];
    var methodArgs = expressionSplit[1].split(",").filter(function (item) {
        return item !== "";
    }).map(function (arg) {
        return evaluateExpression(instance, arg);
    });
    var methodFn = instance.$methods[methodName];

    if (typeof methodFn === "function") {
        return {
            fn: methodFn,
            args: methodArgs
        };
    } else {
        throw new Error("Method not found: '" + expression + "'");
    }
};

var isDefined = function isDefined(val) {
    return typeof val !== "undefined";
};

var retrieveProp = function retrieveProp(instance, expression) {
    var splitExpression = expression.split(".");
    var result = {
        val: null,
        reference: null
    };
    var container = instance.$data;
    var prop = void 0;

    splitExpression.forEach(function (propPath, index) {
        prop = container[propPath];

        if (isDefined("undefined")) {

            if (index < splitExpression.length - 1) {
                container = prop;
            } else {
                result.val = prop;
                result.reference = container;
            }
        } else {
            throw new Error("Property not found: '" + expression + "'");
        }
    });

    return result;
};

var evaluateExpression = function evaluateExpression(instance, expression) {
    if (!isNaN(Number(expression))) {
        //expression is a Number
        return Number(expression);
    } else if (LIB_STRING_QUOTES.includes(expression.substr(0, 1))) {
        //expression is a String
        return expression.substr(1, expression.length - 2);
    } else if (expression.substr(expression.length - 1) === ")") {
        //expression is a Method
        var method = retrieveMethod(instance, expression);

        return method.fn.apply(instance, method.args);
    } else {
        //expression is a Property
        return retrieveProp(instance, expression).val;
    }
};

var directiveIfRender = function directiveIfRender(instance, node, directive) {
    console.log([instance, node, directive]);
    var propValue = evaluateExpression(instance, directive.val);
    var result = Boolean(propValue);

    if (result) {
        node.removeAttribute(DOM_ATTR_HIDDEN);
    } else {
        node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
    }

    return result;
};

var debounce = function debounce(fn, wait, immediate) {
    var timeout = void 0;

    return function () {
        var context = this;
        var args = Array.from(arguments);
        var callNow = immediate && !timeout;
        var later = function later() {
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

var getNodeValueType = function getNodeValueType(node) {
    if (isDefined(node[DOM_ATTR_VALUE])) {
        return DOM_ATTR_VALUE;
    } else if (isDefined(node[DOM_ATTR_TEXT])) {
        return DOM_ATTR_TEXT;
    } else {
        return DOM_ATTR_HTML;
    }
};

var bindEvent = function bindEvent(node, eventType, eventFn, eventArgs, instance) {
    var debouncedFn = debounce(eventFn, DOM_EVENT_TIMEOUT);
    var nodeValueType = getNodeValueType(node);

    var eventFnWrapper = function eventFnWrapper(event) {
        var target = event.target;
        var args = Array.from(eventArgs);

        args.push(target[nodeValueType], target, event);

        return debouncedFn.apply(instance, args);
    };

    return node.addEventListener(eventType, eventFnWrapper, false);
};

var directiveOnInit = function directiveOnInit(instance, node, directive) {
    var targetMethod = retrieveMethod(instance, directive.val);

    bindEvent(node, directive.opt, targetMethod.fn, targetMethod.args, instance);

    return true;
};

var directiveModelInit = function directiveModelInit(instance, node, directive) {
    var targetProp = retrieveProp(instance, directive.val);
    var eventFn = function eventFn(currentValue, newValue) {
        targetProp.reference[directive.val] = newValue;

        setTimeout(function () {
            instance.$render();
        }, DOM_EVENT_TIMEOUT);
    };

    bindEvent(node, DOM_EVENT_MODEL, eventFn, [targetProp.val], instance);

    return true;
};

var directiveModelRender = function directiveModelRender(instance, node, directive) {
    var nodeValueType = getNodeValueType(node);
    var propValue = retrieveProp(instance, directive.val);

    node[nodeValueType] = propValue.val;

    return true;
};

var directiveBindRender = function directiveBindRender(instance, node, directive) {
    var propValue = evaluateExpression(instance, directive.val);

    node.setAttribute(directive.opt, propValue);

    return true;
};

var directives = {
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

var execDirectives = function execDirectives(instance, domMap, execMode) {
    var recurseMap = function recurseMap(mapNode, depth) {
        var nodeChildren = mapNode.children;
        var nodeDirectives = mapNode.directives;

        //Exec on node
        if (nodeDirectives.length) {
            mapNode.directives.forEach(function (directive) {
                var directiveRef = directives[directive.key];

                if (directiveRef) {
                    var directiveRefFn = directiveRef[execMode];

                    if (directiveRefFn) {
                        directiveRefFn(instance, mapNode.node, directive);
                    }
                }
            });
        }

        //Crawl children
        if (nodeChildren.length) {
            nodeChildren.forEach(function (child) {
                recurseMap(child, depth + 1);
            });
        }
    };

    recurseMap(domMap, 0);
};

var init = function init() {
    var _this = this;

    _this.$cache = mapNodes(_this.$context, function (container, node) {
        //Cache all nodes & directives in the context
        var directives = getDirectives(node);

        container.directives = directives;
    });

    execDirectives(_this, _this.$cache, "init");
    console.log("CALLED $init");
};

var render = function render() {
    var _this = this;

    //Render DOM
    /*crawlNodes(_this.$context, node => {
        return eachDirective(
            node, [{
                name: "ignore",
                fn: () => {
                    return false;
                }
            }, {
                name: "if",
                fn: (name, nameSecondary, value) => {
                    return renderIf(_this, node, value);
                }
            }, {
                name: "model",
                fn: (name, nameSecondary, value) => {
                    return renderModel(_this, node, value);
                }
            }, {
                name: "bind",
                fn: (name, nameSecondary, value) => {
                    return renderBind(_this, node, nameSecondary, value);
                }
            }]
        );
    });*/

    execDirectives(_this, _this.$cache, "render");
    console.log("CALLED $render");
};

/**
 * Basic Axon Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Returns Axon instance
 */
var Axon = function Axon(config) {
    var _this = this;

    _this.$context = document.querySelector(config.context);
    _this.$data = config.data;
    _this.$methods = config.methods;
    _this.$cache = {};

    _this.$init();
    _this.$render();
};

/**
 * Expose Axon methods
 */
Axon.prototype = {
    $init: init,
    $render: render,
    constructor: Axon
};

return Axon;

}());

//# sourceMappingURL=axon.js.map
