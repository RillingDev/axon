"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
     * Store strings to avoid duplicate strings
     */
var _more = ": ";
var _error = "error in ";
var _factory = "factory";
var _service = "service";
var _isUndefined = " is undefined";

/**
     * Checks if service exist, else add it
     *
     * @param {String} type The type of the service (service/factory)
     * @param {Function} cf The Constructor function of the service
     * @param {String} name The name to register/id the service
     * @param {Array} deps List of dependencies
     * @param {Function} fn Content of the service
     * @returns {Object} Returns `this`
     */
function provider(type, cf, name, deps, fn) {
    var _this = this;

    if (_this.chev[name]) {
        //throw error if a service with this name already exists
        throw _this.id + _more + _error + name + " already exists";
    } else {
        //Add the service to container
        _this.chev[name] = {
            type: type,
            cf: cf,
            name: name,
            deps: deps,
            fn: fn,
            init: false
        };

        return _this;
    }
}

/**
     * Adds a new service type
     *
     * @param {String} type The name of the type
     * @param {Function} cf Constructor function to init the service with
     * @returns {Object} Returns `this`
     */
function extend(type, cf) {
    var _this = this;

    //Add customType method to container
    _this[type] = function (name, deps, fn) {
        return _this.provider(type, cf, name, deps, fn);
    };

    return _this;
}

/**
     * Collects dependencies and initializes service
     *
     * @private
     * @param {Object} _this The context
     * @param {Object} service The service to check
     * @param {Object} list The list of dependencies
     * @returns {Object} Returns `service`
     */
function initialize(_this, service, list) {
    if (!service.init) {
        (function () {
            var bundle = [];

            //Collect an ordered Array of dependencies
            service.deps.forEach(function (item) {
                var dependency = list[item];

                if (dependency) {
                    bundle.push(dependency.fn);
                }
            });

            //Init service
            //Call Constructor fn with service/deps
            service = service.cf(service, bundle);
            service.init = true;
        })();
    }

    return service;
}

/**
     * Loops trough dependencies, recurse if new dependencies has dependencies itself; then execute fn.
     *
     * @private
     * @param {Object} _this The context
     * @param {Array} service The dependencyList to iterate
     * @param {Function} fn The function run over each dependency
     * @returns void
     */
function recurseDependencies(_this, service, fn) {
    //loop trough deps
    service.deps.forEach(function (name) {
        var dependency = _this.chev[name];

        if (dependency) {
            //recurse over sub-deps
            recurseDependencies(_this, dependency, fn);
            //run fn
            fn(dependency);
        } else {
            //if not found error with name
            throw _this.id + _more + _error + service.name + _more + "dependency " + name + _isUndefined;
        }
    });
}

/**
     * Check if every dependency is available
     *
     * @private
     * @param {Object} _this The context
     * @param {Object} service The service to prepare
     * @returns {Object} Initialized service
     */
function prepare(_this, service) {
    var list = {};

    //Recurse trough service deps
    recurseDependencies(_this, service,
    //run this over every dependency to add it to the dependencyList
    function (dependency) {
        //make sure if dependency is initialized, then add
        list[dependency.name] = initialize(_this, dependency, list);
    });

    return initialize(_this, service, list);
}

/**
     * Access service with dependencies bound
     *
     * @param {String} name The Name of the service
     * @returns {*} Returns Content of the service
     */
function access(name) {
    var _this = this,
        accessedService = _this.chev[name];

    //Check if accessed service is registered
    if (accessedService) {
        //Call prepare with bound context
        return prepare(_this, accessedService).fn;
    }
}

/**
     * Creates method entry for service
     *
     * @private
     * @param {Object} _this The context
     * @returns Returns void
     */
function initService(_this) {
    _this.extend(_service, function (service, bundle) {
        //Construct service
        var serviceFn = service.fn;

        service.fn = function () {
            //Chevron service function wrapper
            return serviceFn.apply(null, bundle.concat(Array.from(arguments)));
        };

        return service;
    });
}

/**
     * Creates method entry for factory
     *
     * @private
     * @param {Object} _this The context
     * @returns Returns void
     */
function initFactory(_this) {
    _this.extend(_factory, function (service, bundle) {
        //Construct factory

        //First value gets ignored by calling new like this, so we need to fill it
        bundle.unshift(null);

        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service.fn = new (Function.prototype.bind.apply(service.fn, bundle))();

        return service;
    });
}

/**
     * Basic Chevron Constructor
     *
     * @constructor
     * @param {String} id To identify the instance
     * @returns {Object} Returns Chevron instance
     */
var Chevron = function Chevron(id) {
    var _this = this;

    //Instance Id
    _this.id = id || "cv";
    //Instance container
    _this.chev = {};

    //Init default types
    initService(_this);
    initFactory(_this);
};

/**
 * Expose Chevron methods
 */
Chevron.prototype = {
    //Core service/factory method
    provider: provider,
    //Prepare/init services/factory with deps injected
    access: access,
    //Add new service type
    extend: extend
};

/**
     * Store contsants
     */
var _window = window;
var _document = _window.document;
var _domNameSpace = "xn";

/**
     * Creates querySelector string
     *
     * @private
     * @param {String} data The data id
     * @param {String} val The data value
     * @return {String} Returns Query
     */
function constructQuery(data, val) {
    if (!val || val === "*") {
        return "[" + _domNameSpace + "-" + data + "]";
    } else {
        return "[" + _domNameSpace + "-" + data + "='" + val + "']";
    }
}

/**
     * Query multiple from DOM
     *
     * @private
     * @param {String} data The data id
     * @param {String} val The data value
     * @param {Node} context optional, query context
     * @return {NodeList} Returns NodeList
     */
function query(data, val, context) {
    return (context ? context : _document).querySelectorAll(constructQuery(data, val));
}

/**
     * Read Data from element
     *
     * @private
     * @param {Node} element The Element to read
     * @param {String} data The data attr to read
     * @return {String} Returns value
     */
function read(element, data) {
    return element.attributes[_domNameSpace + "-" + data].value;
}

/**
     * Digest & renders dom
     *
     * @private
     * @param {Object} ctrl The Controller
     * @return {Node} context The Controller context
     */
function digest() {}

/**
     * Binds event to dom
     *
     * @private
     * @param {NodeList} domList The Elements to bind
     * @param {String} type The Event type
     * @param {Function} fn The Even function
     * @return {Array} Returns Array of events
     */
function bind(domList, type, fn) {
    //const result = {};
    var i = 0;

    [].forEach.call(domList, function (dom) {
        /*result[i] = */
        dom.addEventListener(type, function (ev) {
            return fn(ev, dom);
        }, false);

        i++;
    });

    return i;
}

/**
     * Binds xn-model
     *
     * @private
     * @param {Object} ctrl The Controller
     * @return {Node} context The Controller context
     */
function bindModel(ctrl, context) {
    var elements = query("model", "*", context);

    bind(elements, "change", modelEvent);
    bind(elements, "keydown", modelEvent);

    return elements;

    function modelEvent(ev, dom) {
        var content = dom.value;
        var modelFor = read(dom, "model");

        console.log("MODEL:", modelFor, content);
        ctrl[modelFor] = content;

        digest();
    }
}

/**
     * Binds expressions to controller
     *
     * @private
     * @param {Object} ctrl The Controller
     * @return {Object} Returns bound Object
     */
function bindDirectives(ctrl) {
    var context = ctrl.context;

    return {
        model: bindModel(ctrl, context)
    };
}

/**
     * Read Data from element
     *
     * @private
     * @param {Node} element The Element to read
     * @param {String} data The data attr to read
     * @return {String} Returns value
     */
function queryExpressions() {}

/**
     * Binds directives to controller
     *
     * @private
     * @param {Object} ctrl The Controller
     * @return {Object} Returns bound Object
     */
function bindExpressions(ctrl) {
    var context = ctrl.context;

    return {
        expressions: queryExpressions(context)
    };
}

/**
     * Creates typeList entry for Controller
     *
     * @private
     * @param {Object} _this The context
     * @return void
     */
function controllerFn(service, bundle) {
    //Construct Controller
    //
    //First value gets ignored by calling new like this, so we need to fill it
    bundle.unshift(null);
    //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
    var ctrl = service.fn = new (Function.prototype.bind.apply(service.fn, bundle))();
    //Bind Context
    ctrl.$context = query("controller", service.name)[0];
    ctrl.$directives = bindDirectives(ctrl);
    ctrl.$expressions = bindExpressions(ctrl);

    return service;
}

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
    _this.context = query("app", id)[0];

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

exports.default = Axon;
//# sourceMappingURL=axon.es.js.map
