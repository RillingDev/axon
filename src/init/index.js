"use strict";

import execDirectives from "../directives/execDirectives";
import getDomMap from "../dom/getDomMap";

const init = function () {
    const _this = this;

     _this.$cache = getDomMap(_this.$context);
    execDirectives(_this, _this.$cache, "init");
    console.log("CALLED $init");
};

export default init;
