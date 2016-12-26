"use strict";

import crawlNodes from "../dom/crawlNodes";
import eachDirective from "../dom/eachDirective";
import bindEvent from "../dom/bindEvent";

import retrieveMethod from "../controller/retrieveMethod";

const init = function () {
    const _this = this;

    //Bind events
    crawlNodes(_this.$context, node => {
        eachDirective(
            node, ["on"],
            directive => {
                const eventFn = retrieveMethod(_this, directive.value);

                bindEvent(node, directive.secondary, eventFn, [], _this);
            }
        );
    });
};

export default init;
