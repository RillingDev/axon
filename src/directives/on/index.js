"use strict";


import directiveEventOnInit from "./lib/directiveEventOnInit";
import directiveEventOnRender from "./lib/directiveEventOnRender";
import directiveEventOnApply from "./lib/directiveEventOnApply";

const directiveEvent = {
    name: "on",
    onInit: directiveEventOnInit,
    onRender: directiveEventOnRender,
    onApply: directiveEventOnApply
};

export default directiveEvent;
