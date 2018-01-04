import {
    bindEvent
} from "../dom/event";
import {
    applyMethodContext
} from "../vdom/controller";
import {
    evalMethod
} from "../vdom/controller";
import { IAxonDirective, IAxonNode } from "../interfaces";

/**
 * v-on init directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveOnInit = (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => {
    bindEvent(element, directive.opt, (e: any) => applyMethodContext(evalMethod(directive.content, node), [e]));

    return true;
};

export {
    directiveOnInit
};
