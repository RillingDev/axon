import {
    evalDirective
} from "../vdom/controller";
import {
    DOM_PROP_HTML
} from "../constants";
import { IAxonDirective, IAxonNode } from "../interfaces";

/**
 * v-html render directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveHTMLRender = (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => {
    element[DOM_PROP_HTML] = String(evalDirective(directive.content, node).val);

    return true;
};

export {
    directiveHTMLRender
};