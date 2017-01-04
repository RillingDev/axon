"use strict";

import crawlNodes from "../dom/crawlNodes";
import eachDirective from "../dom/eachDirective";

import initOn from "./initOn";
import initModel from "./initModel";

const init = function () {
    const _this = this;

    //Bind events
    crawlNodes(_this.$context, node => {
        return eachDirective(
            node, [{
                name: "on",
                fn: (name, nameSecondary, value) => {
                    return initOn(_this, node, nameSecondary, value);
                }
            }, {
                name: "model",
                fn: (name, nameSecondary, value) => {
                    return initModel(_this, node, value);
                }
            }]
        );
    });

    console.log("CALLED $init");
};

export default init;
