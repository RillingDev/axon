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
const directiveBindRender = (directive: any, element: any, node: any) => {
    element.setAttribute(directive.opt, evalDirective(directive.content, node).val);

    return true;
};

export {
    directiveBindRender
};
