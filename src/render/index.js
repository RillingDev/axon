"use strict";

import execDirectives from "../directives/execDirectives";

const render = function () {
    const _this = this;

    execDirectives(_this, _this.$cache, "render");
    console.log("CALLED $render");
};

export default render;
