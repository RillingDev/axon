import { evalProp } from "../vdom/controller";
import {
    getElementContentProp,
    getInputEventType,
    bindEvent
} from "../dom/element";
import { IAxonDirective, IAxonNode } from "../interfaces";

/**
 * v-model init directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveModelInit = (
    directive: IAxonDirective,
    element: HTMLElement,
    node: IAxonNode
) => {
    const elementContentProp = getElementContentProp(element);
    const elementEventType = getInputEventType(element);

    bindEvent(element, elementEventType, () => {
        const targetProp = evalProp(directive.content, node);

        // @ts-ignore
        targetProp.container[targetProp.key] = element[elementContentProp];
    });

    return true;
};

/**
 * v-model render directive
 *
 * @private
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveModelRender = (
    directive: IAxonDirective,
    element: HTMLElement,
    node: IAxonNode
) => {
    const elementContentProp = getElementContentProp(element);
    const targetProp = evalProp(directive.content, node);

    // @ts-ignore
    element[elementContentProp] = targetProp.val;

    return true;
};

export { directiveModelInit, directiveModelRender };
