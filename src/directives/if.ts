import {
    evalDirective
} from "../vdom/controller";
import {
    setElementActive
} from "../dom/element";
import { IAxonDirective, IAxonNode } from "../interfaces";

/**
 * v-if directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveIfBoth = (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => {
    const expressionValue = Boolean(evalDirective(directive.content, node, true).val);

    setElementActive(element, expressionValue);

    return expressionValue;
};

export {
    directiveIfBoth
};
