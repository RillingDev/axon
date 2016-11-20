"use strict";

//Chevron import
import extend from "../node_modules/chevronjs/src/api/extend";
import provider from "../node_modules/chevronjs/src/api/provider";
import access from "../node_modules/chevronjs/src/api/access";

import initService from "../node_modules/chevronjs/src/types/service";
import initfactory from "../node_modules/chevronjs/src/types/factory";

import {
    _document
} from "./lib/constants";
import initController from "./types/controller/index";
import queryDirective from "./dom/query/queryDirective";

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
    _this.extend("service", initService);
    _this.extend("factory", initfactory);
    _this.extend("controller", initController.bind(_this));
};

/**
 * Expose Axon methods
 */
Axon.prototype = {
    extend, //Creates a new module type
    provider, //Adds a new custom module to the container
    access //Returns initialized module
};

export default Axon;
