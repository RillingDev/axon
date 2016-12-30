"use strict";

import crawlNodes from "../dom/crawlNodes";
import eachDirective from "../dom/eachDirective";

import renderIf from "./renderIf";
import renderModel from "./renderModel";
import renderBind from "./renderBind";

const render = function () {
    const _this = this;

    //Render DOM
    crawlNodes(_this.$context, node => {
        console.log(node);
        eachDirective(
            node, [{
                name: "if",
                fn: (name, nameSecondary, value) => {
                    renderIf(_this, node, value);
                }
            }, {
                name: "model",
                fn: (name, nameSecondary, value) => {
                    renderModel(_this, node, value);
                }
            }, {
                name: "bind",
                fn: (name, nameSecondary, value) => {
                    renderBind(_this, node, nameSecondary, value);
                }
            }]
        );
    });

    console.log("CALLED $render");
};

export default render;
