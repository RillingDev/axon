/**
 * Axon v0.6.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

var Axon = (function () {
'use strict';

/**
 * Adds a new module type to the Chevron instance
 * @param {String} type The name of the type
 * @param {Function} cf Constructor function to init the module with
 * @returns {Object} Chevron instance
 */

var extend = function extend(type, cf) {
    var _this = this;

    //Add customType method to container
    _this[type] = function (name, deps, fn) {
        return _this.provider(type, //static
        cf, //static
        name, //dynamic
        deps, //dynamic
        fn //dynamic
        );
    };

    return _this;
};

/**
 * Collects dependencies and initializes module
 * @private
 * @param {Object} _module The module to check
 * @param {Object} list The list of dependencies
 * @param {Function} cf The Constructor function
 * @returns {Object} Initialized _module
 */

var constructModule = function constructModule(_module, list, constructorFunction) {
    var dependencies = [];
    var result = void 0;

    //Collect an ordered Array of dependencies
    _module.deps.forEach(function (item) {
        var dependency = list[item];

        //If the dependency name is found in the list of deps, add it
        if (dependency) {
            dependencies.push(dependency.fn);
        }
    });

    //Call Constructor fn with _module/deps
    result = constructorFunction(_module, dependencies);
    result.rdy = true;

    return result;
};

/**
 * Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
 * @private
 * @param {Object} chev The chevron container
 * @param {Array} _module The module to recurse
 * @param {Function} fn The function run over each dependency
 */

var recurseDependencies = function recurseDependencies(chev, _module, fn) {
    _module.deps.forEach(function (name) {
        var dependency = chev.get(name);

        if (dependency) {
            //recurse over sub-deps
            recurseDependencies(chev, dependency, fn);
            //run fn
            fn(dependency);
        } else {
            //if the dependency is not found, throw error with name
            throw new Error(_module.name + " is missing dep '" + name + "'");
        }
    });
};

/**
 * Inits module and all dependencies
 * @private
 * @param {Object} chev The chevron container
 * @param {Object} _module The module to prepare
 * @param {Function} cf The constructor function
 * @returns {Object} Initialized module
 */
var initialize = function initialize(chev, _module, constructorFunction) {
    var list = {};

    //Recurse trough _module deps
    recurseDependencies(chev, _module,
    //run this over every dependency to add it to the dependencyList
    function (dependency) {
        //make sure if dependency is initialized, then add
        list[dependency.name] = dependency.rdy ? dependency : dependency.init();
    });

    return constructModule(_module, list, constructorFunction);
};

/**
 * Adds a new module to the container
 * @param {String} type The type of the module. ex: "factory"
 * @param {Function} cf The constructor function of the module
 * @param {String} name The name to register the module under. ex: "myFactory"
 * @param {Array} deps Array of dependenciy names
 * @param {Function} fn Content of the module
 * @returns {Object} Chevron instance
 */
var provider = function provider(type, constructorFunction, name, deps, fn) {
    var _this = this;
    var entry = {
        type: type, //Type of the module
        name: name, //Name of the module
        deps: deps, //Array of dependencies
        fn: fn, //Module content function
        rdy: false, //If the module is ready to access
        init: function init() {
            return initialize(_this.chev, entry, constructorFunction); //init the module
        }
    };

    //Saves entry to chev container
    _this.chev.set(name, entry);

    return _this;
};

/**
 * Access module with dependencies bound
 * @param {String} name The name of the module to access
 * @returns {Mixed} Initialized Object content
 */

var access = function access(name) {
  return this.chev.get(name).init().fn;
};

/**
 * Constructor function for the service type
 * @private
 * @param {Object} _module The module object
 * @param {Array} dependencies Array of dependency contents
 * @returns {Mixed} Initialized _module
 */

var service = function service(_module, dependencies) {
    //Dereference fn to avoid unwanted recursion
    var serviceFn = _module.fn;

    _module.fn = function () {
        //Chevron service function wrapper
        //return function with args injected
        return serviceFn.apply(null, dependencies.concat(Array.from(arguments)));
    };

    return _module;
};

/**
 * Constructor function for the factory type
 * @private
 * @param {Object} _module The module object
 * @param {Array} dependencies Array of dependency contents
 * @returns {Mixed} Initialized module
 */

var factory = function factory(_module, dependencies) {
    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    _module.fn = new (Function.prototype.bind.apply(_module.fn, dependencies))();

    return _module;
};

/**
 * Store constants
 */


var _document = document;
var _domNameSpace = "xn";
var _debounceTimeout = 40;
//export const _expressionRegex = /{{(.+)}}/g;

/**
 * Get directive dom name
 * @param  {String} name Directive name
 * @return {String}      Dom name
 */
var getDataQueryDom = function getDataQueryDom(name) {
    return _domNameSpace + "-" + name;
};

/**
 * Get directive dataset name
 * @param  {String} name Directive name
 * @return {String}      Dataset name
 */

/**
 * Creates querySelector string
 *
 * @private
 * @param {String} name The data name
 * @param {String} val The data value
 * @return {String} Returns Query
 */
var getSelectorQuery = function getSelectorQuery(name, val) {
    var dataQuery = getDataQueryDom(name);

    if (val) {
        return "[" + dataQuery + "='" + val + "']";
    } else {
        return "[" + dataQuery + "]";
    }
};

/**
 * Queries all nodes in context with the given directive
 * @param  {Node}  context     Context to query
 * @param  {String}  name         Directive name
 * @param  {String|Boolean}  val          Directive value, or false if it should be ignored
 * @param  {Boolean} [multi=true] If more than one element should be queried
 * @return {Node|NodeList}               Query result
 */
var queryDirective = function queryDirective(context, name, val) {
    var multi = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    var query = getSelectorQuery(name, val);

    return multi ? context.querySelectorAll(query) : context.querySelector(query);
};

/**
 * Misc Utility functions
 */

/**
 * iterate over NodeList
 *
 * @private
 * @param {NodeList} NodeList The Elements to bind
 * @param {Function} fn The Function to call
 * @returns void
 */

function eachNode(NodeList, fn) {
    var l = NodeList.length;
    var i = 0;

    while (i < l) {
        fn(NodeList[i], i);
        i++;
    }
}
/**
 * Iterate object
 *
 * @private
 * @param {Object} object The Object to iterate
 * @param {Function} fn The Function to run
 * @returns void
 */
/*export function eachObject(object, fn) {
    const keys = Object.keys(object);
    const l = keys.length;
    let i = 0;

    while (i < l) {
        const currentKey = keys[i];

        fn(object[currentKey], currentKey, i);
        i++;
    }
}*/
/**
 * replace string at position
 *
 * @private
 * @param {String} string The String to exec
 * @param {String} find The String to find
 * @param {String} replace The String to replace
 * @param {Number} index The Index to start replacing
 * @returns {String} replacedString
 */
/*export function replaceFrom(string, find, replace, index) {
    return string.substr(0, index) + string.substr(index).replace(find, replace);
}*/

/**
 * Get value of directive on node
 * @param  {Node} node Node to check
 * @param  {String} name Directive to check
 * @return {String}      Directive value
 */
var getDirectiveValue = function getDirectiveValue(node, name) {
    var dataQuery = getDataQueryDom(name);

    return node.attributes[dataQuery].value;
};

var debounce = function debounce(fn, wait, immediate) {
    var timeout = void 0;

    return function () {
        var context = this;
        var args = arguments;
        var later = function later() {
            timeout = null;
            if (!immediate) {
                fn.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            fn.apply(context, args);
        }
    };
};

var bindEvent = function bindEvent(node, eventType, eventFn) {
    var debouncedFn = debounce(eventFn, _debounceTimeout);

    node.addEventListener(eventType, debouncedFn, false);
};

var applyDirectives = function applyDirectives(ctrl) {
    ctrl.$directives.forEach(function (directive) {
        directive.forEach(function (directiveInstance) {
            directiveInstance.instanceOf.onApply(directiveInstance.node, ctrl, directiveInstance.data);
        });
    });
};

var renderDirectives = function renderDirectives(ctrl) {
    ctrl.$directives.forEach(function (directive) {
        directive.forEach(function (directiveInstance) {
            directiveInstance.instanceOf.onRender(directiveInstance.node, ctrl, directiveInstance.data);
        });
    });
};

// UI -> Ctrl
var apply = function apply(ctrl) {
    var applyFn = debounce(applyDirectives, _debounceTimeout);
    var renderFn = debounce(renderDirectives, _debounceTimeout);

    console.log("C:APPLY");
    console.log(ctrl);

    applyFn(ctrl);
    renderFn(ctrl);
};

// Ctrl -> UI
var render = function render(ctrl) {
    var renderFn = debounce(renderDirectives, _debounceTimeout);
    var applyFn = debounce(applyDirectives, _debounceTimeout);

    console.log("C:RENDER");
    renderFn(ctrl);
    applyFn(ctrl);
};

var directiveModelOnInit = function directiveModelOnInit(node, ctrl, directiveContent) {
    var modelType = typeof node.value !== "undefined" ? "value" : "innerText";
    var eventFn = function eventFn(ev) {
        apply(ctrl);
    };

    render(ctrl);

    //Bin dependent on nodetype
    bindEvent(node, "change", eventFn);
    bindEvent(node, "keydown", eventFn);

    return {
        modelType: modelType,
        modelFor: directiveContent
    };
};

var directiveModelOnRender = function directiveModelOnRender(node, ctrl, data) {
    console.log("D:RENDER");
    node[data.modelType] = ctrl[data.modelFor];
};

var directiveModelOnApply = function directiveModelOnApply(node, ctrl, data) {
  console.log("D:APPLY");
  ctrl[data.modelFor] = node[data.modelType];
};

var directiveModel = {
    name: "model",
    onInit: directiveModelOnInit,
    onRender: directiveModelOnRender,
    onApply: directiveModelOnApply
};

var directiveEventOnInit = function directiveEventOnInit(node, ctrl, directiveContent) {
    var delemitEventList = function delemitEventList(str) {
        return str.split(",").map(function (pair) {
            return pair.trim().split(":").map(function (item) {
                return item.trim();
            });
        });
    };
    var events = delemitEventList(directiveContent);

    events.forEach(function (eventItem) {
        var eventFn = function eventFn(ev) {
            var fn = ctrl[eventItem[1]];
            console.log("C:FIRED");
            fn(ev, node);

            //render(ctrl);
        };

        bindEvent(node, eventItem[0], eventFn);
    });

    return {
        events: events
    };
};

var directiveEventOnRender = function directiveEventOnRender(node, ctrl, data) {};

var directiveEventOnApply = function directiveEventOnApply(node, ctrl, data) {};

var directiveEvent = {
    name: "on",
    onInit: directiveEventOnInit,
    onRender: directiveEventOnRender,
    onApply: directiveEventOnApply
};

var directives = [directiveEvent, directiveModel];

/**
 * Binds all directive plugins to the controller
 * @param  {Object} ctrl Axon controller
 * @return {Array}      Array of directive results
 */
var bindDirectives = function bindDirectives(ctrl) {
    var result = [];

    directives.forEach(function (directive) {
        var directiveResult = [];
        var directiveNodes = queryDirective(ctrl.$context, directive.name, false, true);

        eachNode(directiveNodes, function (node) {
            directiveResult.push({
                node: node,
                instanceOf: directive,
                data: directive.onInit(node, ctrl, getDirectiveValue(node, directive.name))
            });
        });

        result.push(directiveResult);
    });

    return result;
};

/**
 * Constructor function for the controller type
 * @private
 * @param {Object} _module The module object
 * @param {Array} dependencies Array of dependency contents
 * @returns {Mixed} Initialized module
 */
var typeController = function typeController(_module, dependencies) {
    var _this = this;
    var ctrl = void 0;

    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    ctrl = new (Function.prototype.bind.apply(_module.fn, dependencies))();

    //Bind Context
    ctrl.$context = queryDirective(_this.$context, "controller", _module.name, false);
    //ctrl.$expressions = bindExpressions(_module.fn);
    ctrl.$directives = bindDirectives(ctrl);
    //run first digest
    ctrl.$render = function () {
        render(ctrl);
    };
    ctrl.$apply = function () {
        apply(ctrl);
    };
    //ctrl.$render();


    _module.fn = ctrl;

    return _module;
};

//Chevron import

/**
 * Basic Axon Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Returns Axon instance
 */
var Axon = function Axon(id) {
    var _this = this;

    //Instance Id
    _this.$id = id;
    //Instance container
    _this.chev = new Map();
    //context
    _this.$context = queryDirective(_document, "app", id, false);

    //Init default types
    _this.extend("service", service);
    _this.extend("factory", factory);
    _this.extend("controller", typeController.bind(_this));
};

/**
 * Expose Axon methods
 */
Axon.prototype = {
    extend: extend, //Creates a new module type
    provider: provider, //Adds a new custom module to the container
    access: access //Returns initialized module
};

return Axon;

}());

//# sourceMappingURL=axon.js.map
