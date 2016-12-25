"use strict";

import crawlNodes from "../dom/crawlNodes";

const init = function () {
    const _this = this;

    crawlNodes(_this.$context, node => {
        console.log("N", node);

        return true;
    });
};

export default init;
