"use strict";


import directiveModelOnInit from "./lib/directiveModelOnInit";
import directiveModelOnRender from "./lib/directiveModelOnRender";
import directiveModelOnApply from "./lib/directiveModelOnApply";

const directiveModel = {
    name: "model",
    onInit: directiveModelOnInit,
    onRender: directiveModelOnRender,
    onApply: directiveModelOnApply
};

export default directiveModel;
