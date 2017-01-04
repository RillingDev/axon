"use strict";

import eachDirective from "../dom/eachDirective";
import crawlNodes from "../dom/crawlNodes";

import renderIf from "./renderIf";
import renderModel from "./renderModel";
import renderBind from "./renderBind";

const render = function () {
    const _this = this;

    //Render DOM
    crawlNodes(_this.$context, node => {
        return eachDirective(
            node, [{
                name: "ignore",
                fn: () => {
                    return false;
                }
            }, {
                name: "if",
                fn: (name, nameSecondary, value) => {
                    return renderIf(_this, node, value);
                }
            }, {
                name: "model",
                fn: (name, nameSecondary, value) => {
                    return renderModel(_this, node, value);
                }
            }, {
                name: "bind",
                fn: (name, nameSecondary, value) => {
                    return renderBind(_this, node, nameSecondary, value);
                }
            }]
        );
    });

    console.log("CALLED $render");
};

export default render;
