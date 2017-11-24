import {
    evalDirective
} from "../vdom/controller";

/**
 * v-bind render directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveBindRender = (directive, element, node) => {
    element.setAttribute(directive.opt, evalDirective(directive.content, node).val);

    return true;
};

export {
    directiveBindRender
};
