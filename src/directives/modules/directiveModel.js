"use strict";

import {DOM_EVENT_MODEL} from "../../constants";
import {bindEvent} from "../../dom/event";
import retrieveProp from "../../controller/retrieveProp";
import getNodeContentProp from "../../dom/getNodeContentProp";

const directiveModelInit = function (directive, node) {
    const element = node._element;
    const elementContentProp = getNodeContentProp(element);
    const targetProp = retrieveProp(directive.val, node);

    const eventFn = function () {
        const newVal = element[elementContentProp];

        console.log(newVal);
        targetProp.ref.data[directive.val] = newVal;
        targetProp.ref.render();
    };

    bindEvent(node._element, DOM_EVENT_MODEL, eventFn);

    return true;
};

const directiveModelRender = function (directive, node) {
    const element = node._element;
    const elementContentProp = getNodeContentProp(element);
    const targetProp = retrieveProp(directive.val, node);

    console.log("MODEL", [
        directive, node
    ], [elementContentProp, targetProp]);

    element[elementContentProp] = targetProp.val;

    return true;
};

export {directiveModelInit, directiveModelRender};
