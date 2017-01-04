"use strict";

import crawlNodes from "../dom/crawlNodes";
import eachDirective from "../dom/eachDirective";

import renderIf from "./renderIf";
import renderModel from "./renderModel";
import renderBind from "./renderBind";

const render = function skip(skipModel = false) {
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
                    if (!skipModel) {
                        return renderModel(_this, node, value);
                    } else {
                        return true;
                    }
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
