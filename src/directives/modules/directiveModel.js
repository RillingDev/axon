"use strict";

import {
    DOM_EVENT_MODEL
} from "../../constants";
import {
    bindEvent
} from "../../dom/event";
import {
    retrieveProp
} from "../../controller/retrieve";
import {
    getElementContentProp
} from "../../dom/element";

const directiveModelInit = function (directive, node) {
    const element = node._element;
    const elementContentProp = getElementContentProp(element);
    const eventFn = function () {
        const targetProp = retrieveProp(directive.val, node);

        targetProp.con[targetProp.key] = element[elementContentProp];
        targetProp.node.render();
    };

    bindEvent(element, DOM_EVENT_MODEL, eventFn);

    return true;
};

const directiveModelRender = function (directive, node) {
    const element = node._element;
    const elementContentProp = getElementContentProp(element);
    const targetProp = retrieveProp(directive.val, node);

    element[elementContentProp] = String(targetProp.val);

    return true;
};

export {
    directiveModelInit,
    directiveModelRender
};
