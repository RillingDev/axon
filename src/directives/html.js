import {
    evalDirective
} from "../vdom/controller";
import {
    DOM_PROP_HTML
} from "../constants";

/**
 * v-html render directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveHTMLRender = function (directive, node) {
    node.$element[DOM_PROP_HTML] = String(evalDirective(directive.content, node).val);

    return true;
};

export {
    directiveHTMLRender
};
