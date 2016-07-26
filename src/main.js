"use strict";

import Chevron from "../node_modules/chevronjs/src/main.js";

let Axon = function (id) {
    let _this = this;
    id = id || "xn";

    _this.id = id;
    _this.chev = new Chevron(id + "Chev");
};

Axon.prototype = {};

export default Axon;
