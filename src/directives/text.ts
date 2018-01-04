import {
    evalDirective
} from "../vdom/controller";
import {
    DOM_PROP_TEXT
} from "../constants";
import { IAxonDirective, IAxonNode } from "../interfaces";

/**
 * v-text render directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveTextRender = (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => {
    element[DOM_PROP_TEXT] = String(evalDirective(directive.content, node).val);

    return true;
};

export {
    directiveTextRender
};
