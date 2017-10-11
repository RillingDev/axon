import {
    bindEvent
} from "../../dom/event";
import {
    applyMethodContext,
    retrieveMethod
} from "../../controller/retrieve";

const directiveOnInit = function (directive, node) {
    bindEvent(node.$element, directive.opt, () => applyMethodContext(retrieveMethod(directive.content, node)));

    return true;
};

export {
    directiveOnInit
};
