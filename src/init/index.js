"use strict";

import crawlNodes from "../dom/crawlNodes";
import eachDirective from "../dom/eachDirective";

import initOn from "./initOn";

const init = function () {
    const _this = this;

    //Bind events
    crawlNodes(_this.$context, node => {
        eachDirective(
            node, [{
                name: "on",
                fn: directive => {
                    initOn(_this, node, directive.secondary, directive.value);
                }
            }]
        );

        return true;
    });

    console.log("CALLED $init");
};

export default init;
