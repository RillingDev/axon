import {
    evalDirective
} from "../vdom/controller";
import {
    DOM_PROP_TEXT
} from "../constants";

/**
 * v-text render directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveTextRender = function (directive: any, element: any, node: any) {
    element[DOM_PROP_TEXT] = String(evalDirective(directive.content, node).val);

    return true;
};

export {
    directiveTextRender
};
