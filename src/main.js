"use strict";

import {
    _document
} from "./lib/constants";
import Chevron from "../node_modules/chevronjs/src/main";
//import controllerFn from "./types/controller";
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
    _this.$container = new Chevron();
    //Instance container

    //context
    _this.$context = queryDirective(_document, "app", id, false);

    //Init Axon types
    //_this.$container.extend("controller", controllerFn);
};

export default Axon;
