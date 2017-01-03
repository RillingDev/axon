/**
 * Axon v0.9.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

var Axon = (function () {
'use strict';

var _document = document;

var DEBOUNCE_TIMEOUT = 40; //event timeout in ms

var DOM_PREFIX = "x-";

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
        if (attr.name.substr(0, DOM_PREFIX.length) === DOM_PREFIX) {
            var splitName = attr.name.replace(DOM_PREFIX, "").split(":");
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

var getNodeValueType = function getNodeValueType(node) {
    if (typeof node.value !== "undefined") {
        return "value";
    } else if (typeof node.textContent !== "undefined") {
        return "textContent";
    } else {
        return "innerHTML";
    }
};

var bindEvent = function bindEvent(node, eventType, eventFn, eventArgs, instance) {
    var debouncedFn = debounce(eventFn, DEBOUNCE_TIMEOUT);
    var nodeValueType = getNodeValueType(node);

    var eventFnWrapper = function eventFnWrapper(event) {
        var target = event.target;
        var args = Array.from(eventArgs);

        args.push(target[nodeValueType], target, event);

        return debouncedFn.apply(instance, args);
    };

    return node.addEventListener(eventType, eventFnWrapper, false);
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var retrieveProp = function retrieveProp(instance, propName) {
    var castNumber = Number(propName);
    var stringChars = ["'", "\"", "`"];

    if (!isNaN(castNumber)) {
        //If number
        return castNumber;
    } else if (stringChars.includes(propName[0])) {
        //If String
        return propName.substr(1, propName.length - 2);
    } else {
        var _ret = function () {
            //If Prop
            var propPath = propName.split(".");
            var prop = instance.$data;

            propPath.forEach(function (propItem) {
                prop = prop[propItem];
            });

            if (typeof prop === "undefined") {
                throw new Error("prop '" + propName + "' not found");
            } else {
                return {
                    v: prop
                };
            }
        }();

        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    }
};

var retrieveMethod = function retrieveMethod(instance, methodString) {
    var methodStringSplit = methodString.substr(0, methodString.length - 1).split("(");
    var methodName = methodStringSplit[0];
    var methodArgs = methodStringSplit[1].split(",").filter(function (item) {
        return item !== "";
    }).map(function (arg) {
        return retrieveProp(instance, arg);
    });

    var methodFn = instance.$methods[methodName];

    if (typeof methodFn !== "function") {
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

var renderIf = function renderIf(instance, node, propName) {
    var propValue = retrieveProp(instance, propName);
    var result = Boolean(propValue);

    if (result) {
        node.removeAttribute("hidden");
    } else {
        node.setAttribute("hidden", result);
    }

    return result;
};

var renderModel = function renderModel(instance, node, propName) {
    var nodeValueType = getNodeValueType(node);
    var propValue = retrieveProp(instance, propName);

    node[nodeValueType] = propValue;

    return true;
};

var renderBind = function renderBind(instance, node, bindType, propName) {
    var propValue = retrieveProp(instance, propName);

    node.setAttribute(bindType, propValue);

    return true;
};

var render = function render() {
    var _this = this;

    //Render DOM
    crawlNodes(_this.$context, function (node) {
        //console.log(node);
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
    var autoInit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var _this = this;

    _this.$context = _document.querySelector(config.context);
    _this.$data = config.data;
    _this.$methods = config.methods;

    if (autoInit) {
        _this.$init();
        _this.$render();
    }
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
