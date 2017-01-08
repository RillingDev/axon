"use strict";

import execDirectives from "../directives/execDirectives";

const render = function () {
    const _this = this;

    //Render DOM
    /*crawlNodes(_this.$context, node => {
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
    });*/

    execDirectives(_this, _this.$cache, "render");
    console.log("CALLED $render");
};

export default render;
