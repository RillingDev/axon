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
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveIfBoth = function (directive, node) {
    const element = node.$element;
    const expressionValue = Boolean(evalDirective(directive.content, node, true).val);

    setElementActive(element, expressionValue);

    return expressionValue;
};

export {
    directiveIfBoth
};
