"use strict";

import crawlNodes from "../dom/crawlNodes";
import eachDirective from "../dom/eachDirective";

import renderModel from "./renderModel";
import renderBind from "./renderBind";

const render = function() {
    const _this = this;

    //Bind events
    crawlNodes(_this.$context, node => {
        eachDirective(
            node, ["model","bind"],
            directive => {
                if (directive.name === "model") {
                    renderModel(_this, node, directive.value);
                }else if(directive.name === "bind"){
                     renderBind(_this, node, directive.secondary,directive.value);
                }
            }
        );
    });

    console.log("CALLED $render");
};

export default render;
