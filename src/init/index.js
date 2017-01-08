"use strict";

import mapNodes from "../dom/mapNodes";
import getDirectives from "../dom/getDirectives";
import execDirectives from "../directives/execDirectives";

const init = function () {
    const _this = this;

     _this.$cache = mapNodes(_this.$context, (container, node) => {
        //Cache all nodes & directives in the context
        const directives = getDirectives(node);

        container.directives = directives;
    });

    execDirectives(_this, _this.$cache, "init");
    console.log("CALLED $init");
};

export default init;
