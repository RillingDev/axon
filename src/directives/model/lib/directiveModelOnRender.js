"use strict";

const directiveModelOnDigest = function(node, ctrl, data) {
    ctrl[data.modelFor] = node[data.modelType];
};

export default directiveModelOnDigest;
