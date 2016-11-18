/**
 * Axon v0.3.0
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
 * Store constants
 */
const _window = window;
const _document = _window.document;
const _domNameSpace = "xn";

/**
 * Creates querySelector string
 *
 * @private
 * @param {String} name The data name
 * @param {String} val The data value
 * @return {String} Returns Query
 */
const constructQuery = function(name, val) {
    if (val) {
        return `[${_domNameSpace}-${name}='${val}']`;
    } else {
        return `[${_domNameSpace}-${name}]`;
    }
};

/**
 * Query Nodes with directives from DOM
 *
 * @private
 * @param {Node} context Node context to query
 * @param {String} name The data name
 * @param {String} val The data value
 * @param {Boolean} multi optional, if multiple should be queried
 * @return {NodeList} Returns NodeList
 */
const queryDirective = function(context, name, val, multi = true) {
    const query = constructQuery(name, val);

    return multi ? context.querySelectorAll(query) : context.querySelector(query);
};

//import bindDirectives from "../dom/bind/directives";
//import bindExpressions from "../dom/bind/expressions";

//import digest from "../dom/digest/digest";

/**
 * Constructor function for the controller type
 * @private
 * @param {Object} _module The module object
 * @param {Array} dependencies Array of dependency contents
 * @returns {Mixed} Initialized module
 */
const controller = function(_module, dependencies) {
    const _this = this;
    let ctrl;

    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    ctrl = _module.fn = new(Function.prototype.bind.apply(_module.fn, dependencies));


    //Bind Context
    ctrl.$context = queryDirective(_this.context, "controller", _module.name, false);
    //_module.fn.$expressions = bindExpressions(_module.fn);
    //_module.fn.$directives = bindDirectives(_module.fn);
    //run first digest
    //digest(_module.fn);

    console.log(_this);

    return _module;
};

//Chevron import
//Axon import
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
    _this.id = id;

    //Instance container
    _this.chev = new Map();

    //context
    _this.context = queryDirective(_document, "app", id, false);

    //Init default types
    _this.extend.call(_this, "controller", controller.bind(_this));
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
