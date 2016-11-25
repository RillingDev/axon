/**
 * Axon v0.6.0
 * Author: Felix Rilling
 * Repository: git+https://github.com/FelixRilling/axonjs.git
 */

'use strict';

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
 * Store constants
 */

const _document = document;
const _domNameSpace = "xn";
const _debounceTimeout = 40;
//export const _expressionRegex = /{{(.+)}}/g;

/**
 * Get directive dom name
 * @param  {String} name Directive name
 * @return {String}      Dom name
 */
const getDataQueryDom = function(name) {
    return `${_domNameSpace}-${name}`;
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
const getSelectorQuery = function(name, val) {
    const dataQuery = getDataQueryDom(name);

    if (val) {
        return `[${dataQuery}='${val}']`;
    } else {
        return `[${dataQuery}]`;
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
const queryDirective = function(context, name, val, multi = true) {
    const query = getSelectorQuery(name, val);

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
const getDirectiveValue = function(node, name) {
    const dataQuery = getDataQueryDom(name);

    return node.attributes[dataQuery].value;
};

const debounce = function(fn, wait, immediate) {
    let timeout;

    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) {
                fn.apply(context, args);
            }
        };
        const callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            fn.apply(context, args);
        }
    };
};

const bindEvent = function(node, eventType, eventFn) {
    const debouncedFn = debounce(eventFn, _debounceTimeout);

    node.addEventListener(eventType, debouncedFn, false);
};

const applyDirectives = function(ctrl) {
    ctrl.$directives.forEach(directive => {
        directive.forEach(directiveInstance => {
            directiveInstance.instanceOf.onApply(directiveInstance.node, ctrl, directiveInstance.data);
        });
    });
};

const renderDirectives = function(ctrl) {
    ctrl.$directives.forEach(directive => {
        directive.forEach(directiveInstance => {
            directiveInstance.instanceOf.onRender(directiveInstance.node, ctrl, directiveInstance.data);
        });
    });
};

// UI -> Ctrl
const apply = function(ctrl) {
    const applyFn = debounce(applyDirectives, _debounceTimeout);
    const renderFn = debounce(renderDirectives, _debounceTimeout);

    console.log("C:APPLY");
    console.log(ctrl);

    applyFn(ctrl);
    renderFn(ctrl);
};

const directiveModelOnInit = function(node, ctrl, directiveContent) {
    const modelType = typeof node.value !== "undefined" ? "value" : "innerText";
    const eventFn = function(ev) {
        apply(ctrl);
    };

    node[modelType] = ctrl[directiveContent];

    //Bin dependent on nodetype
    bindEvent(node, "change", eventFn);
    bindEvent(node, "keydown", eventFn);

    return {
        modelType,
        modelFor: directiveContent
    };
};

const directiveModelOnRender = function(node, ctrl, data) {
    console.log("D:RENDER");
    node[data.modelType] = ctrl[data.modelFor];
};

const directiveModelOnApply = function(node, ctrl, data) {
  console.log("D:APPLY");
    ctrl[data.modelFor] = node[data.modelType];
};

const directiveModel = {
    name: "model",
    onInit: directiveModelOnInit,
    onRender: directiveModelOnRender,
    onApply: directiveModelOnApply
};

// Ctrl -> UI
const render = function(ctrl) {
    const renderFn = debounce(renderDirectives, _debounceTimeout);
    const applyFn = debounce(applyDirectives, _debounceTimeout);

    console.log("C:RENDER");
    renderFn(ctrl);
    applyFn(ctrl);
};

const directives = [
    directiveModel,
    //on
];

/**
 * Binds all directive plugins to the controller
 * @param  {Object} ctrl Axon controller
 * @return {Array}      Array of directive results
 */
const bindDirectives = function(ctrl) {
    const result = [];

    directives.forEach(directive => {
        const directiveResult = [];
        const directiveNodes = queryDirective(ctrl.$context, directive.name, false, true);

        eachNode(directiveNodes, node => {
            directiveResult.push({
                node,
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
const typeController = function(_module, dependencies) {
    const _this = this;
    let ctrl;

    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    ctrl = new(Function.prototype.bind.apply(_module.fn, dependencies));


    //Bind Context
    ctrl.$context = queryDirective(_this.$context, "controller", _module.name, false);
    //ctrl.$expressions = bindExpressions(_module.fn);
    ctrl.$directives = bindDirectives(ctrl);
    //run first digest
    ctrl.$render = function() {
        render(ctrl);
    };
    ctrl.$apply = function() {
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
const Axon = function(id) {
    const _this = this;

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
    extend, //Creates a new module type
    provider, //Adds a new custom module to the container
    access //Returns initialized module
};

module.exports = Axon;
