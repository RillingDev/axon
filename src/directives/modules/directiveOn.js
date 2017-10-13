import {
    bindEvent
} from "../../dom/event";
import {
    applyMethodContext
} from "../../controller/retrieve";
import {
    evalMethod
} from "../../controller/retrieve";

const directiveOnInit = function (directive, node) {
    const method = evalMethod(directive.content, node);

    bindEvent(node.$element, directive.opt, e => applyMethodContext(method, [e]));

    return true;
};

export {
    directiveOnInit
};
