import {
    bindEvent
} from "../../dom/event";
import {
    applyMethodContext
} from "../../controller/retrieve";
import {
    evalMethod
} from "../../controller/retrieve";

/**
 * v-on init directive
 *
 * @param {Object} directive
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveOnInit = function (directive, node) {
    bindEvent(node.$element, directive.opt, e => applyMethodContext(evalMethod(directive.content, node), [e]));

    return true;
};

export {
    directiveOnInit
};
