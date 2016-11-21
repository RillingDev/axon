"use strict";


import directiveEventOnInit from "./lib/directiveEventOnInit";
import directiveEventOnRender from "./lib/directiveEventOnRender";

const directiveEvent = {
    name: "on",
    onInit: directiveEventOnInit,
    onRender: directiveEventOnRender
};

export default directiveEvent;
