"use strict";

import provider from "chevronjs/src/api/provider";
import extend from "chevronjs/src/api/extend";
import access from "chevronjs/src/access/access";

import initService from "chevronjs/src/types/service";
import initFactory from "chevronjs/src/types/factory";

import initModule from "./types/module";
import initController from "./types/controller";
/**
 * Basic Axon Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Returns Axon instance
 */
let Axon = function (id) {
    const _this = this;

    //Instance Id
    _this.id = id || "cv";
    //Instance transformerList
    _this.tl = {};
    //Instance container
    _this.chev = {};

    //Init default types
    initService(_this);
    initFactory(_this);
    //Init Axon types
    initModule(_this);
    initController(_this);
};

/**
 * Expose Axon methods
 */
Axon.prototype = {
    //Core service/factory method
    provider,
    //Prepare/init services/factory with deps injected
    access,
    //Add new service type
    extend
};

export default Axon;
