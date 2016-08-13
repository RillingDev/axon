"use strict";

import Chevron from "chevronjs/dist/es6/chevron.es.js";

import controllerFn from "./types/controller";

import querySingle from "./dom/querySingle";
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
    _this.context = querySingle("app", id);

    //Init Axon types
    _this.cv.extend("controller", controllerFn);
};

//Bind Chevron methods directly to parent
const methods = ["access", "extend", "provider", "service", "factory", "controller"];

methods.forEach(method => {
    Axon.prototype[method] = function() {
        return this.cv[method].apply(this, Array.from(arguments));
    };
});


export default Axon;
