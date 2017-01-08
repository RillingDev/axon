"use strict";

import mapNodes from "../dom/mapNodes";

const init = function () {
    const _this = this;
    const result = mapNodes(_this.$context, (container, node) => {

    });

    console.log("CALLED $init", result);

    return result;
};

export default init;
