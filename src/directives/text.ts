import { DOM_PROP_TEXT } from "../constants";
import { IAxonDirective, IAxonNode } from "../interfaces";
import { evalDirective } from "../vdom/controller";

/**
 * v-text render directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveTextRender = (
    directive: IAxonDirective,
    element: HTMLElement,
    node: IAxonNode
) => {
    element[DOM_PROP_TEXT] = String(evalDirective(directive.content, node).val);

    return true;
};

export { directiveTextRender };
