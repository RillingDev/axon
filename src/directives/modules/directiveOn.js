import {
    bindEvent
} from "../../dom/event";
import {
    applyMethodContext,
    retrieveMethod
} from "../../controller/retrieve";

const directiveOnInit = function (directive, node) {
    bindEvent(node._element, directive._opt, () => applyMethodContext(retrieveMethod(directive._content, node)));

    return true;
};

export {
    directiveOnInit
};
