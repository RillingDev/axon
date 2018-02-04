import { setElementActive } from "../dom/element";
import { IAxonDirective, IAxonNode } from "../interfaces";
import { evalDirective } from "../vdom/controller";

/**
 * v-if directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveIfRender = (
    directive: IAxonDirective,
    element: HTMLElement,
    node: IAxonNode
) => {
    const expressionValue = Boolean(
        evalDirective(directive.content, node, true).val
    );

    setElementActive(element, expressionValue);

    return expressionValue;
};

export { directiveIfRender };
