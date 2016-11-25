"use strict";

const directiveModelOnRender = function(node, ctrl, data) {
    console.log("D:RENDER");
    node[data.modelType] = ctrl[data.modelFor];
};

export default directiveModelOnRender;
