/**
 * Axon v0.16.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

var Axon = (function () {
'use strict';

var directiveIgnoreBoth = function directiveIgnoreBoth() {
    return false;
};

var DOM_EVENT_TIMEOUT = 20; //event timeout in ms
var DOM_EVENT_MODEL = "input";

var DOM_ATTR_PREFIX = "x-";
var DOM_ATTR_HIDDEN = "hidden";
var DOM_ATTR_VALUE = "value";
var DOM_ATTR_TEXT = "textContent";
var DOM_ATTR_HTML = "innerHTML";

var LIB_STRING_QUOTES = ["'", "\"", "`"];

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
        throw new Error("Missing method '" + expression + "'");
    }
};

var isDefined = function isDefined(val) {
    return typeof val !== "undefined";
};

var retrieveProp = function retrieveProp(instance, expression) {
    var splitExpression = expression.split(".");
    var result = {
        val: null,
        ref: null
    };
    var container = instance.$data;
    var prop = void 0;

    splitExpression.forEach(function (propPath, index) {
        prop = container[propPath];

        if (isDefined(prop)) {

            if (index < splitExpression.length - 1) {
                container = prop;
            } else {
                result.val = prop;
                result.ref = container;
            }
        } else {
            throw new Error("Missing prop '" + expression + "'");
        }
    });

    //console.log(expression,result);

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
    var propValue = evaluateExpression(instance, directive.val);
    var result = Boolean(propValue);

    if (result) {
        node.removeAttribute(DOM_ATTR_HIDDEN);
    } else {
        node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
    }

    return result;
};

var arrayFrom = function arrayFrom(arr) {
    return Array.from(arr);
};

var debounce = function debounce(fn, wait, immediate) {
    var timeout = void 0;

    return function () {
        var context = this;
        var args = arrayFrom(arguments);
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
        var args = arrayFrom(eventArgs);

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
        targetProp.ref[directive.val] = newValue;

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

/*import {
    directiveForInit,
    directiveForRender
} from "./modules/directiveFor";*/

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
    var recurseMap = function recurseMap(mapNode) {
        var nodeChildren = mapNode.children;
        var nodeDirectives = mapNode.directives;
        var result = true;

        //Exec on node
        if (nodeDirectives.length) {
            //Only exec if directives on domNode
            mapNode.directives.forEach(function (directive) {
                var directiveRef = directives[directive.key];

                if (directiveRef) {
                    //Only exec if directive exists
                    var directiveRefFn = directiveRef[execMode];

                    if (directiveRefFn) {
                        //Only exec if directive has fn for current execMode
                        var directiveResult = directiveRefFn(instance, mapNode.node, directive);

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
            nodeChildren.forEach(function (child) {
                recurseMap(child);
            });
        }
    };

    recurseMap(domMap);
};

var getDirectives = function getDirectives(node) {
    var attrArr = arrayFrom(node.attributes);
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var getDomMap = function getDomMap(entry) {
    var recurseNodes = function recurseNodes(node) {
        var nodeDirectives = getDirectives(node);
        var nodeChildren = node.children;

        if (nodeDirectives.length || nodeChildren.length) {
            var _ret = function () {
                var result = {
                    node: node,
                    directives: nodeDirectives,
                    children: []
                };
                var childArr = arrayFrom(nodeChildren);

                childArr.forEach(function (childNode) {
                    var childResult = recurseNodes(childNode);

                    if (isDefined(childResult)) {
                        result.children.push(childResult);
                    }
                });

                return {
                    v: result
                };
            }();

            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
    };

    return recurseNodes(entry);
};

var init = function init() {
  var _this = this;

  _this.$cache = getDomMap(_this.$context);
  execDirectives(_this, _this.$cache, "init");
  console.log("CALLED $init");
};

var render = function render() {
    var _this = this;

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
