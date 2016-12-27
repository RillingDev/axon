"use strict";

import crawlNodes from "../dom/crawlNodes";
import eachDirective from "../dom/eachDirective";
import bindEvent from "../dom/bindEvent";

import retrieveMethod from "../controller/retrieveMethod";

const init = function() {
    const _this = this;

    //Bind events
    crawlNodes(_this.$context, node => {
        eachDirective(
            node, ["on"],
            directive => {
                const targetMethod = retrieveMethod(_this, directive.value);

                bindEvent(node, directive.secondary, targetMethod.fn, targetMethod.args, _this);
            }
        );
    });

    console.log("CALLED $init");
};

export default init;
