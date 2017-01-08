"use strict";

import getDirectives from "../dom/getDirectives";
import execDirectives from "../directives/execDirectives";
import getDomMap from "../dom/getDomMap";

const init = function () {
    const _this = this;

     _this.$cache = getDomMap(_this.$context, (container, node) => {
        //Cache all nodes & directives in the context
        const directives = getDirectives(node);

        container.directives = directives;
    });

    execDirectives(_this, _this.$cache, "init");
    console.log("CALLED $init");
};

export default init;
