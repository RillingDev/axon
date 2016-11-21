"use strict";


import directiveModelOnInit from "./lib/directiveModelOnInit";
import directiveModelOnRender from "./lib/directiveModelOnRender";

const directiveModel = {
    name: "model",
    onInit: directiveModelOnInit,
    onRender: directiveModelOnRender
};

export default directiveModel;
