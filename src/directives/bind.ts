import {
    evalDirective
} from "../vdom/controller";
import { IAxonDirective, IAxonNode } from "../interfaces";

/**
 * v-bind render directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveBindRender = (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => {
    element.setAttribute(directive.opt, evalDirective(directive.content, node).val);

    return true;
};

export {
    directiveBindRender
};
