"use strict";

import crawlNodes from "../dom/crawlNodes";
import eachDirective from "../dom/eachDirective";

import renderModel from "./renderModel";
import renderBind from "./renderBind";

const render = function () {
    const _this = this;

    //Bind events
    crawlNodes(_this.$context, node => {
        eachDirective(
            node, [{
                name: "model",
                fn: directive => {
                    renderModel(_this, node, directive.value);
                }
            }, {
                name: "bind",
                fn: directive => {
                    renderBind(_this, node, directive.secondary, directive.value);
                }
            }]
        );
    });

    console.log("CALLED $render");
};

export default render;
