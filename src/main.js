"use strict";

import Chevron from "chevronjs/dist/es6/chevron.es.js";

import controllerFn from "./types/controller";

import domQuery from "./dom/query";
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
    //_this.context = domQuery("app", id);

    //Init Axon types
    _this.cv.extend("controller", controllerFn);


    /**
     * Expose Axon methods
     */
};

const methods = ["access","extend", "provider","service","factory","controller"];

methods.forEach(method => {
    Axon.prototype[method] = function() {
        return this.cv[method].apply(this, Array.from(arguments));
    };
});
/*Axon.prototype = {
    access: _this.cv.access,
    extend: _this.cv.extend,
    provider: _this.cv.provider,

    service: _this.cv.service,
    factory: _this.cv.factory,
    controller: _this.cv.controller,
};*/


export default Axon;
