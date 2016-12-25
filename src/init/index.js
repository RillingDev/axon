"use strict";

import crawlNodes from "../dom/crawlNodes";
import getDirectives from "../dom/getDirectives";

const init = function () {
    return crawlNodes(this.$context, node => {
        return getDirectives(
            node, ["on"],
            (name, eventType, eventFn) => {
                console.log(name, eventType, eventFn);
            }
        );
    });
};

export default init;
