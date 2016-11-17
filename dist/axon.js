/**
 * Axon v0.3.0
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
 * Chevron Constructor
 * @constructor
 * @returns {Object} Chevron instance
 */
var Chevron = function Chevron() {
    var _this = this;

    //Instance container
    _this.chev = new Map();

    //Init default types
    _this.extend("service", service);
    _this.extend("factory", factory);
};

/**
 * Expose Chevron methods
 */
Chevron.prototype = {
    extend: extend, //Creates a new module type
    provider: provider, //Adds a new custom module to the container
    access: access //Returns initialized module
};

/**
 * Store constants
 */

var _window = window;
var _document = _window.document;
var _domNameSpace = "xn";
var _expressionRegex = /{{(.+)}}/g;

/**
 * Creates querySelector string
 *
 * @private
 * @param {String} data The data id
 * @param {String} val The data value
 * @return {String} Returns Query
 */
var constructQuery = function (data, val) {
    if (!val || val === "*") {
        return "[" + _domNameSpace + "-" + data + "]";
    } else {
        return "[" + _domNameSpace + "-" + data + "='" + val + "']";
    }
};

/**
 * Query multiple from DOM
 *
 * @private
 * @param {String} data The data id
 * @param {String} val The data value
 * @param {Node} context optional, query context
 * @return {NodeList} Returns NodeList
 */
var queryDirective = function (data, val, context) {
    return (context ? context : _document).querySelectorAll(constructQuery(data, val));
};

/**
 * Read Data from element
 *
 * @private
 * @param {Node} element The Element to read
 * @param {String} data The data attr to read
 * @return {String} Returns value
 */
var readDirective = function (element, data) {
    return element.attributes[_domNameSpace + "-" + data].value;
};

/**
 * Misc Utility functions
 */

/**
 * iterate over NoddeList
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
function eachObject(object, fn) {
    var keys = Object.keys(object);
    var l = keys.length;
    var i = 0;

    while (i < l) {
        var currentKey = keys[i];

        fn(object[currentKey], currentKey, i);
        i++;
    }
}
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
function replaceFrom(string, find, replace, index) {
    return string.substr(0, index) + string.substr(index).replace(find, replace);
}

var text = {
    onBind: function onBind(ctrl, context) {
        var result = [];
        var nodes = getTextNodes(context);
        var match = void 0;

        //Iterate Nodes
        nodes.forEach(function (node) {
            //Iterate Regex
            while ((match = _expressionRegex.exec(node.textContent)) !== null) {
                if (match.index === _expressionRegex.lastIndex) {
                    _expressionRegex.lastIndex++;
                }

                result.push({
                    match: match[0],
                    data: match[1],
                    val: match[0],
                    index: match.index,
                    parent: node
                });
            }
        });

        return result;

        //Modified version of http://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
        function getTextNodes(node) {
            var all = [];
            for (node = node.firstChild; node; node = node.nextSibling) {
                if (node.nodeType === 3 && node.parentNode.nodeName !== "SCRIPT") {
                    all.push(node);
                } else {
                    all = all.concat(getTextNodes(node));
                }
            }
            return all;
        }
    },
    onDigest: function onDigest(ctrl, context, entry) {
        var result = ctrl[entry.data];

        entry.parent.textContent = replaceFrom(entry.parent.textContent, entry.val, result, entry.index);
        entry.val = result;

        return result;
    }
};

var expressions = {
    text: text
};

/**
 * Digest & render dom
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Node} context The Controller context
 */
var digest = function (ctrl) {
    //@TODO implement debounce

    iteratePlugins(directives, ctrl.$directives, function (entry, plugin) {
        plugin.onDigest(ctrl, ctrl.$context, entry);
    });

    iteratePlugins(expressions, ctrl.$expressions, function (entry, plugin) {
        plugin.onDigest(ctrl, ctrl.$context, entry);
    });

    function iteratePlugins(pluginData, data, fn) {
        eachObject(pluginData, function (plugin, key) {
            var active = data[key];

            active.forEach(function (entry) {
                fn(entry, plugin);
            });
        });
    }
};

/**
 * Binds event to dom
 *
 * @private
 * @param {NodeList} domList The Elements to bind
 * @param {String} type The Event type
 * @param {Function} fn The Even function
 * @return void
 */
var bind = function (domList, type, fn) {
    eachNode(domList, function (dom) {
        dom.addEventListener(type, eventFn, false);

        function eventFn(ev) {
            return fn(ev, dom);
        }
    });
};

var model = {
    onBind: function onBind(ctrl, context) {
        var result = [];
        var elements = queryDirective("model", "*", context);

        bind(elements, "change", modelEvent);
        bind(elements, "input", modelEvent);

        eachNode(elements, function (element, index) {
            result.push({
                index: index,
                element: element,
                type: "model",
                value: readDirective(element, "model")
            });
        });

        return result;

        function modelEvent(ev, dom) {
            _window.setTimeout(function () {
                var content = dom.value;
                var modelFor = readDirective(dom, "model");

                console.log("MODEL:", modelFor, content);
                ctrl[modelFor] = content;

                digest(ctrl);
            }, 5);
        }
    },
    onDigest: function onDigest(ctrl, context, entry) {
        entry.element.value = ctrl[entry.value];
    }
};

//import changeImported from "./change";

var directives = {
    model: model
};

/**
 * Binds directives to controller
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Object} Returns bound Object
 */
var bindDirectives = function (ctrl) {
    var result = {};

    eachObject(directives, function (directive, key, index) {
        result[key] = directive.onBind(ctrl, ctrl.$context);
    });

    return result;
};

/**
 * Binds expressions to controller
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Object} Returns bound Object
 */
var bindExpressions = function (ctrl) {
    var result = {};

    eachObject(expressions, function (expressions$$1, key, index) {
        result[key] = expressions$$1.onBind(ctrl, ctrl.$context);
    });

    return result;
};

/**
 * Creates typeList entry for Controller
 *
 * @private
 * @param {Object} service The service
 * @param {Object} bundle The service deps
 * @return {Function} service
 */
var controllerFn = function (service, bundle) {
    //Construct Controller
    //
    //First value gets ignored by calling new like this, so we need to fill it
    bundle.unshift(null);
    //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
    var ctrl = service.fn = new (Function.prototype.bind.apply(service.fn, bundle))();

    //Bind Context
    ctrl.$context = queryDirective("controller", service.name)[0];
    ctrl.$expressions = bindExpressions(ctrl);
    ctrl.$directives = bindDirectives(ctrl);
    //run first digest
    digest(ctrl);

    console.log(service);

    return service;
};

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
    _this.id = id;
    //Instance container
    _this.cv = new Chevron(id + "Container");
    //context
    _this.context = queryDirective("app", id)[0];

    //Init Axon types
    _this.cv.extend("controller", controllerFn);
};

//Bind Chevron methods directly to parent
var methods = ["access", "extend", "provider", "service", "factory", "controller"];

methods.forEach(function (method) {
    Axon.prototype[method] = function () {
        return this.cv[method].apply(this.cv, Array.from(arguments));
    };
});

return Axon;

}());

//# sourceMappingURL=axon.js.map
