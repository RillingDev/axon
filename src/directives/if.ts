import {
    evalDirective
} from "../vdom/controller";
import {
    setElementActive
} from "../dom/element";

/**
 * v-if directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveIfBoth = function (directive: any, element: any, node: any) {
    const expressionValue = Boolean(evalDirective(directive.content, node, true).val);

    setElementActive(element, expressionValue);

    return expressionValue;
};

export {
    directiveIfBoth
};
