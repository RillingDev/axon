"use strict";

const directiveModelOnApply = function(node, ctrl, data) {
  console.log("D:APPLY");
    ctrl[data.modelFor] = node[data.modelType];
};

export default directiveModelOnApply;
