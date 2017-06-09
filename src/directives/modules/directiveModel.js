"use strict";

import {DOM_EVENT_MODEL} from "../../constants";
import {bindEvent} from "../../dom/event";
import retrieveProp from "../../controller/retrieveProp";
import getElementContentProp from "../../dom/getElementContentProp";

const directiveModelInit = function (directive, node) {
    const element = node._element;
    const elementContentProp = getElementContentProp(element);

    const eventFn = function () {
        const targetProp = retrieveProp(directive.val, node);
        const newVal = element[elementContentProp];

        //Update and render data node
        targetProp.node.data[directive.val] = newVal;
        targetProp.node.render();
    };

    bindEvent(node._element, DOM_EVENT_MODEL, eventFn);

    return true;
};

const directiveModelRender = function (directive, node) {
    const element = node._element;
    const elementContentProp = getElementContentProp(element);
    const targetProp = retrieveProp(directive.val, node);

    element[elementContentProp] = targetProp.val;

    return true;
};

export {directiveModelInit, directiveModelRender};
