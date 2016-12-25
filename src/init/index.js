"use strict";

import crawlNodes from "../dom/crawlNodes";
import getDirectives from "../dom/getDirectives";
import bindEventString from "../dom/bindEventString";

const init = function () {
    const _this = this;

    return crawlNodes(_this.$context, node => {
        getDirectives(
            node, ["on"],
            (name, eventType, eventFnString) => {
                bindEventString(node, eventType, eventFnString, _this);
            }
        );
    });
};

export default init;
