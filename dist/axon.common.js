/**
 * Axon v0.4.0
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

/*
import {
    _window
} from "../../../constants";
import {
    eachNode
} from "../../../util";

import queryDirective from "../../../dom/query/directives/query";
import readDirective from "../../../dom/query/directives/read";
import digest from "../../../dom/digest/digest";
import bind from "../../../dom/bind/bind";
*/

const model = {
    onBind: function(ctrl) {
        /*const result = [];
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
        }*/

        return true;
    },
    onDigest: function(ctrl, entry) {
        //entry.element.value = ctrl[entry.value];
        return true;
    }
};

//import changeImported from "./change";

const plugins = [
    model
];

/**
 * Binds directives to controller
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Object} Returns bound Object
 */
const bindDirectives = function(ctrl) {
    const result = [];

    plugins.forEach(directive => {
        result.push(directive.onBind(ctrl));
    });

    return result;
};

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

    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    _module.fn = new(Function.prototype.bind.apply(_module.fn, dependencies));


    //Bind Context
    _module.fn.$context = queryDirective(_this.$context, "controller", _module.name, false);
    //ctrl.$expressions = bindExpressions(_module.fn);
    _module.fn.$directives = bindDirectives(_module.fn);
    //run first digest
    //digest(_module.fn);

    console.log("mainCtrl", _module.fn);

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
    _this.$id = id;

    //Instance container
    _this.chev = new Map();

    //context
    _this.$context = queryDirective(_document, "app", id, false);

    //Init default types
    _this.extend.call(_this, "controller", controller.bind(_this));

    console.log("myApp", _this);
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
