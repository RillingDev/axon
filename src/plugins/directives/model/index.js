"use strict";


import directiveModelOnBind from "./lib/directiveModelOnBind";
import directiveModelOnRender from "./lib/directiveModelOnRender";

const directiveModel = {
    name: "model",
    onBind: directiveModelOnBind,
    onRender: directiveModelOnRender
};

export default directiveModel;
