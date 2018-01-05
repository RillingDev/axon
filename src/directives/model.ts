import {
    bindEvent
} from "../dom/event";
import {
    evalProp
} from "../vdom/controller";
import {
    getElementContentProp
} from "../dom/element";
import { IAxonDirective, IAxonNode } from "../interfaces";

const DOM_EVENT_MODEL = "input";

/**
 * v-model init directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveModelInit = (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => {
    const elementContentProp = getElementContentProp(element);

    bindEvent(element, DOM_EVENT_MODEL, () => {
        const targetProp = evalProp(directive.content, node);

        targetProp.container[targetProp.key] = element[elementContentProp];
    });

    return true;
};

/**
 * v-model render directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveModelRender = (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => {
    const elementContentProp = getElementContentProp(element);
    const targetProp = evalProp(directive.content, node);

    element[elementContentProp] = targetProp.val;

    return true;
};

export {
    directiveModelInit,
    directiveModelRender
};
