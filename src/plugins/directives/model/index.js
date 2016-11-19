"use strict";


import directiveModelOnBind from "./lib/directiveModelOnBind";
import directiveModelOnDigest from "./lib/directiveModelOnDigest";

const directiveModel = {
    name: "model",
    id: "model",
    onBind: directiveModelOnBind,
    onDigest: directiveModelOnDigest
};

export default directiveModel;
