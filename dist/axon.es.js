/**
 * Axon v0.3.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

/**
 * Adds a new module type to the Chevron instance
 * @param {String} type The name of the type
 * @param {Function} cf Constructor function to init the module with
 * @returns {Object} Chevron instance
 */
const extend = function(type, cf) {
    const _this = this;

    //Add customType method to container
    _this[type] = function(name, deps, fn) {
        return _this.provider(
            type, //static
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
const constructModule = function(_module, list, constructorFunction) {
    const dependencies = [];
    let result;

    //Collect an ordered Array of dependencies
    _module.deps.forEach(item => {
        const dependency = list[item];

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
const recurseDependencies = function(chev, _module, fn) {
    _module.deps.forEach(name => {
        const dependency = chev.get(name);

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
const initialize = function(chev, _module, constructorFunction) {
    const list = {};

    //Recurse trough _module deps
    recurseDependencies(
        chev,
        _module,
        //run this over every dependency to add it to the dependencyList
        dependency => {
            //make sure if dependency is initialized, then add
            list[dependency.name] = dependency.rdy ? dependency : dependency.init();
        }
    );

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
const provider = function(type, constructorFunction, name, deps, fn) {
    const _this = this;
    const entry = {
        type, //Type of the module
        name, //Name of the module
        deps, //Array of dependencies
        fn, //Module content function
        rdy: false, //If the module is ready to access
        init: function() {
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
const access = function(name) {
    return this.chev.get(name).init().fn;
};

/**
 * Constructor function for the service type
 * @private
 * @param {Object} _module The module object
 * @param {Array} dependencies Array of dependency contents
 * @returns {Mixed} Initialized _module
 */
const service = function(_module, dependencies) {
    //Dereference fn to avoid unwanted recursion
    const serviceFn = _module.fn;

    _module.fn = function() {
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
const factory = function(_module, dependencies) {
    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    _module.fn = new(Function.prototype.bind.apply(_module.fn, dependencies));

    return _module;
};

/**
 * Chevron Constructor
 * @constructor
 * @returns {Object} Chevron instance
 */
const Chevron = function() {
    const _this = this;

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
    extend, //Creates a new module type
    provider, //Adds a new custom module to the container
    access //Returns initialized module
};

/**
 * Store constants
 */
const _window = window;
const _document = _window.document;
const _domNameSpace = "xn";
const _expressionRegex = /{{(.+)}}/g;

/**
 * Creates querySelector string
 *
 * @private
 * @param {String} data The data id
 * @param {String} val The data value
 * @return {String} Returns Query
 */
var constructQuery = function(data, val) {
    if (!val || val === "*") {
        return `[${_domNameSpace}-${data}]`;
    } else {
        return `[${_domNameSpace}-${data}='${val}']`;
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
var queryDirective = function(data, val, context) {
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
var readDirective = function(element, data) {
    return element.attributes[`${_domNameSpace}-${data}`].value;
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
    const l = NodeList.length;
    let i = 0;

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
    const keys = Object.keys(object);
    const l = keys.length;
    let i = 0;

    while (i < l) {
        const currentKey = keys[i];

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
    onBind: function(ctrl, context) {
        const result = [];
        const nodes = getTextNodes(context);
        let match;

        //Iterate Nodes
        nodes.forEach(node => {
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
            let all = [];
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
    onDigest: function(ctrl, context, entry) {
        const result = ctrl[entry.data];

        entry.parent.textContent = replaceFrom(entry.parent.textContent, entry.val, result, entry.index);
        entry.val = result;

        return result;
    }
};

var expressions = {
    text
};

/**
 * Digest & render dom
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Node} context The Controller context
 */
var digest = function(ctrl) {
    //@TODO implement debounce

    iteratePlugins(directives, ctrl.$directives, (entry, plugin) => {
        plugin.onDigest(ctrl, ctrl.$context, entry);
    });

    iteratePlugins(expressions, ctrl.$expressions, (entry, plugin) => {
        plugin.onDigest(ctrl, ctrl.$context, entry);
    });


    function iteratePlugins(pluginData, data, fn) {
        eachObject(pluginData, (plugin, key) => {
            const active = data[key];

            active.forEach(entry => {
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
var bind = function(domList, type, fn) {
    eachNode(domList, dom => {
        dom.addEventListener(type, eventFn, false);

        function eventFn(ev) {
            return fn(ev, dom);
        }
    });
};

var model = {
    onBind: function(ctrl, context) {
        const result = [];
        const elements = queryDirective("model", "*", context);

        bind(elements, "change", modelEvent);
        bind(elements, "input", modelEvent);

        eachNode(elements, (element, index) => {
            result.push({
                index,
                element,
                type: "model",
                value: readDirective(element, "model")
            });
        });

        return result;

        function modelEvent(ev, dom) {
            _window.setTimeout(() => {
                const content = dom.value;
                const modelFor = readDirective(dom, "model");

                console.log("MODEL:", modelFor, content);
                ctrl[modelFor] = content;

                digest(ctrl);
            }, 5);
        }
    },
    onDigest: function(ctrl, context, entry) {
        entry.element.value = ctrl[entry.value];
    }
};

//import changeImported from "./change";

var directives = {
    model
};

/**
 * Binds directives to controller
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Object} Returns bound Object
 */
var bindDirectives = function(ctrl) {
    const result = {};

    eachObject(directives, (directive, key, index) => {
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
var bindExpressions = function(ctrl) {
    const result = {};

    eachObject(expressions, (expressions$$1, key, index) => {
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
var controllerFn = function(service, bundle) {
    //Construct Controller
    //
    //First value gets ignored by calling new like this, so we need to fill it
    bundle.unshift(null);
    //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
    const ctrl = service.fn = new(Function.prototype.bind.apply(service.fn, bundle));


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
let Axon = function(id) {
    const _this = this;

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
const methods = ["access", "extend", "provider", "service", "factory", "controller"];

methods.forEach(method => {
    Axon.prototype[method] = function() {
        return this.cv[method].apply(this.cv, Array.from(arguments));
    };
});

export default Axon;
