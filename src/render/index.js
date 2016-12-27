"use strict";

import crawlNodes from "../dom/crawlNodes";
import eachDirective from "../dom/eachDirective";

import model from "./model";

const render = function() {
    const _this = this;

    //Bind events
    crawlNodes(_this.$context, node => {
        eachDirective(
            node, ["model"],
            directive => {
                if (directive.name === "model") {
                    model(_this, node, directive.value);
                }
            }
        );
    });

    console.log("CALLED $render");
};

export default render;
