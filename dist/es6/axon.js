var Axon = (function () {
    'use strict';

    /**
         * Store strings to avoid duplicate strings
         */
        const _more = ": ";
        const _error = "error in ";
        const _factory = "factory";
        const _service = "service";
        const _isUndefined = " is undefined";

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
    function provider (type, cf, name, deps, fn) {
            const _this = this;

            if (_this.chev[name]) {
                //throw error if a service with this name already exists
                throw _this.id + _more + _error + name + " already exists";
            } else {
                //Add the service to container
                _this.chev[name] = {
                    type,
                    cf,
                    name,
                    deps,
                    fn,
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
    function extend (type, cf) {
            const _this = this;

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
    function initialize (_this, service, list) {
            if (!service.init) {
                const bundle = [];

                //Collect an ordered Array of dependencies
                service.deps.forEach(item => {
                    const dependency = list[item];

                    if (dependency) {
                        bundle.push(dependency.fn);
                    }
                });

                //Init service
                //Call Constructor fn with service/deps
                service = service.cf(service, bundle);
                service.init = true;
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
            service.deps.forEach(name => {
                const dependency = _this.chev[name];

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
            const list = {};

            //Recurse trough service deps
            recurseDependencies(
                _this,
                service,
                //run this over every dependency to add it to the dependencyList
                dependency => {
                    //make sure if dependency is initialized, then add
                    list[dependency.name] = initialize(_this, dependency, list);
                }
            );

            return initialize(_this, service, list);
        }

    /**
         * Access service with dependencies bound
         *
         * @param {String} name The Name of the service
         * @returns {*} Returns Content of the service
         */
    function access(name) {
            const _this = this,
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
            _this.extend(_service, function(service, bundle) {
                //Construct service
                const serviceFn = service.fn;

                service.fn = function() {
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
            _this.extend(_factory, function(service, bundle) {
                //Construct factory

                //First value gets ignored by calling new like this, so we need to fill it
                bundle.unshift(null);

                //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
                service.fn = new(Function.prototype.bind.apply(service.fn, bundle));

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
        let Chevron = function(id) {
            const _this = this;

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
            provider,
            //Prepare/init services/factory with deps injected
            access,
            //Add new service type
            extend
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
    function constructQuery(data, val) {
            if (!val || val === "*") {
                return `[${_domNameSpace}-${data}]`;
            } else {
                return `[${_domNameSpace}-${data}='${val}']`;
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
    function queryDirective(data, val, context) {
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
    function readDirective(element, data) {
            return element.attributes[`${_domNameSpace}-${data}`].value;
        }

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

    /**
         * calculates Expression
         *
         * @private
         * @param {Object} ctrl The Controller
         * @param {Object} expression The Expression
         * @return void
         */
    function evaluate(ctrl, expression) {
            const result = ctrl[expression.data];
            console.log([ctrl, expression.data, ctrl[expression.data]]);


            //console.log(["!!!!!!!!!!!!!", expression.val, result]);
            expression.parent.textContent = replaceFrom(expression.parent.textContent, expression.val, result, expression.index);

            expression.val = result;

            return result;
        }

    /**
         * Digest & render dom
         *
         * @private
         * @param {Object} ctrl The Controller
         * @return {Node} context The Controller context
         */
    function digest(ctrl) {
            //@TODO implement debounce

            console.log("digest");
            //Calc expressions
            ctrl.$expressions.forEach(expression => {
                evaluate(ctrl, expression);
            });
        }

    /**
         * Binds event to dom
         *
         * @private
         * @param {NodeList} domList The Elements to bind
         * @param {String} type The Event type
         * @param {Function} fn The Even function
         * @return void
         */
    function bind(domList, type, fn) {
            eachNode(domList, dom => {
                dom.addEventListener(type, eventFn, false);

                function eventFn(ev) {
                    return fn(ev, dom);
                }
            });
        }

    /**
         * Binds xn-model
         *
         * @private
         * @param {Object} ctrl The Controller
         * @return {Node} context The Controller context
         */
    function bindModel(ctrl, context) {
            const result = [];
            const elements = queryDirective("model", "*", context);

            bind(elements, "change", modelEvent);
            bind(elements, "keydown", modelEvent);

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
                const content = dom.value;
                const modelFor = readDirective(dom, "model");

                console.log("MODEL:", modelFor, content);
                ctrl[modelFor] = content;

                digest(ctrl);
            }
        }

    /**
         * Binds directives to controller
         *
         * @private
         * @param {Object} ctrl The Controller
         * @return {Object} Returns bound Object
         */
    function bindDirectives(ctrl) {
            const context = ctrl.$context;

            return {
                model: bindModel(ctrl, context)
            };
        }

    /**
         * Query Expressions
         *
         * @private
         * @param {Node} context The Element context
         * @return {NodeList} Returns NodeList
         */
    function queryExpressions(context) {
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
                        parent : node
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
        }

    /**
         * Binds expressions
         *
         * @private
         * @return {Node} context The Controller context
         */
    function bindExpressions$1(context) {
            const elements = queryExpressions(context);

            return elements;
        }

    /**
         * Binds directives to controller
         *
         * @private
         * @param {Object} ctrl The Controller
         * @return {Object} Returns bound Object
         */
    function bindExpressions(ctrl) {
            const context = ctrl.$context;
            return bindExpressions$1(context);
        }

    /**
         * Creates typeList entry for Controller
         *
         * @private
         * @param {Object} service The service
         * @param {Object} bundle The service deps
         * @return {Function} service
         */
    function controllerFn(service, bundle) {
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
        }

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

    return Axon;

}());