"use strict";

import Chevron from "../node_modules/chevronjs/src/main.js";

let Axon = function (id) {
    let _this = this;

    _this.id = id || "xn";
    _this.chev = new Chevron(id);
};

Axon.prototype = {};

export default Axon;
