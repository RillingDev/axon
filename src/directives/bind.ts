import {
    evalDirective
} from "../vdom/controller";
import { IAxonDirective, IAxonNode } from "../interfaces";

/**
 * v-bind render directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
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
