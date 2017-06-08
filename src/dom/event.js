"use strict";
//@TODO

//import getNodeValueType from "./getNodeValueType";

const bindEvent = function (node, eventType, eventFn) {
    return node.addEventListener(eventType, eventFn, false);
};

export {
    bindEvent
};
