import { IAxonDirective, IAxonNode } from "../interfaces";
import { evalDirective } from "../vdom/controller";

/**
 * v-bind render directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveBindRender = (
    directive: IAxonDirective,
    element: HTMLElement,
    node: IAxonNode
) => {
    element.setAttribute(
        directive.opt,
        evalDirective(directive.content, node).val
    );

    return true;
};

export { directiveBindRender };
