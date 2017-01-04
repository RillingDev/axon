/**
 * Axon v0.11.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

var Axon = (function () {
'use strict';

var _document = document;

var TYPE_NAME_UNDEFINED = "undefined";
var TYPE_NAME_FUNCTION = "function";
var LIB_STRING_QUOTES = ["'", "\"", "`"];
var LIB_DEBOUNCE_TIMEOUT = 32; //event timeout in ms

var DOM_ATTR_PREFIX = "x-";
var DOM_ATTR_HIDDEN = "hidden";

var crawlNodes = function crawlNodes(entry, fn) {
    var recurseNodes = function recurseNodes(node, fn) {
        var result = fn(node);

        if (result && node.childElementCount) {
            var childArr = Array.from(node.children);

            childArr.forEach(function (childNode) {
                result = recurseNodes(childNode, fn);
            });
        }

        return result;
    };

    return recurseNodes(entry, fn);
};

var eachDirective = function eachDirective(node, namesList) {
    var names = namesList.map(function (item) {
        return item.name;
    });
    var attrArr = Array.from(node.attributes);
    var result = true;

    attrArr.forEach(function (attr) {
        //If is Axon attribute
        if (attr.name.substr(0, DOM_ATTR_PREFIX.length) === DOM_ATTR_PREFIX) {
            var splitName = attr.name.replace(DOM_ATTR_PREFIX, "").split(":");
            var nameIndex = names.indexOf(splitName[0]);

            //If name is allowed
            if (nameIndex !== -1) {
                result = namesList[nameIndex].fn(splitName[0], splitName[1], attr.value);
            }
        }
    });

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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var getNodeValueType = function getNodeValueType(node) {
    if (_typeof(node.value) !== TYPE_NAME_UNDEFINED) {
        return "value";
    } else if (_typeof(node.textContent) !== TYPE_NAME_UNDEFINED) {
        return "textContent";
    } else {
        return "innerHTML";
    }
};

var bindEvent = function bindEvent(node, eventType, eventFn, eventArgs, instance) {
    var debouncedFn = debounce(eventFn, LIB_DEBOUNCE_TIMEOUT);
    var nodeValueType = getNodeValueType(node);

    var eventFnWrapper = function eventFnWrapper(event) {
        var target = event.target;
        var args = Array.from(eventArgs);

        args.push(target[nodeValueType], target, event);

        return debouncedFn.apply(instance, args);
    };

    return node.addEventListener(eventType, eventFnWrapper, false);
};

var retrieveProp = function retrieveProp(instance, expression) {
    var splitExpression = expression.split(".");
    var prop = instance.$data;

    splitExpression.forEach(function (propPath) {
        prop = prop[propPath];
    });

    if ((typeof prop === "undefined" ? "undefined" : _typeof(prop)) === TYPE_NAME_UNDEFINED) {
        throw new Error("prop '" + expression + "' not found");
    } else {
        return prop;
    }
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
        return retrieveMethod(instance, expression);
    } else {
        //expression is a Property
        return retrieveProp(instance, expression);
    }
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

    if ((typeof methodFn === "undefined" ? "undefined" : _typeof(methodFn)) !== TYPE_NAME_FUNCTION) {
        throw new Error("method '" + methodName + "' not found");
    } else {
        return {
            fn: methodFn,
            args: methodArgs
        };
    }
};

var initOn = function initOn(instance, node, eventType, methodName) {
    var targetMethod = retrieveMethod(instance, methodName);

    bindEvent(node, eventType, targetMethod.fn, targetMethod.args, instance);

    return true;
};

var init = function init() {
    var _this = this;

    //Bind events
    crawlNodes(_this.$context, function (node) {
        return eachDirective(node, [{
            name: "on",
            fn: function fn(name, nameSecondary, value) {
                return initOn(_this, node, nameSecondary, value);
            }
        }]);
    });

    console.log("CALLED $init");
};

var renderIf = function renderIf(instance, node, expression) {
    var propValue = evaluateExpression(instance, expression);
    var result = Boolean(propValue);

    if (result) {
        node.removeAttribute(DOM_ATTR_HIDDEN);
    } else {
        node.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);
    }

    return result;
};

var renderModel = function renderModel(instance, node, propName) {
    var nodeValueType = getNodeValueType(node);
    var propValue = evaluateExpression(instance, propName);

    node[nodeValueType] = propValue;

    return true;
};

var renderBind = function renderBind(instance, node, bindType, expression) {
    var propValue = evaluateExpression(instance, expression);

    node.setAttribute(bindType, propValue);

    return true;
};

var render = function render() {
    var _this = this;

    //Render DOM
    crawlNodes(_this.$context, function (node) {
        return eachDirective(node, [{
            name: "ignore",
            fn: function fn() {
                return false;
            }
        }, {
            name: "if",
            fn: function fn(name, nameSecondary, value) {
                return renderIf(_this, node, value);
            }
        }, {
            name: "model",
            fn: function fn(name, nameSecondary, value) {
                return renderModel(_this, node, value);
            }
        }, {
            name: "bind",
            fn: function fn(name, nameSecondary, value) {
                return renderBind(_this, node, nameSecondary, value);
            }
        }]);
    });

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

    _this.$context = _document.querySelector(config.context);
    _this.$data = config.data;
    _this.$methods = config.methods;

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
