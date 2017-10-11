import {
    bindEvent
} from "../../dom/event";
import {
    retrieveProp
} from "../../controller/retrieve";
import {
    getElementContentProp
} from "../../dom/element";

const DOM_EVENT_MODEL = "input";

const directiveModelInit = function (directive, node) {
    const element = node._element;
    const elementContentProp = getElementContentProp(element);
    const eventFn = function () {
        const targetProp = retrieveProp(directive._content, node);

        targetProp._container[targetProp._key] = element[elementContentProp];
        targetProp._node.render();
    };

    bindEvent(element, DOM_EVENT_MODEL, eventFn);

    return true;
};

const directiveModelRender = function (directive, node) {
    const element = node._element;
    const elementContentProp = getElementContentProp(element);
    const targetProp = retrieveProp(directive._content, node);

    element[elementContentProp] = String(targetProp._val);

    return true;
};

export {
    directiveModelInit,
    directiveModelRender
};
