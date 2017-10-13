import {
    bindEvent
} from "../../dom/event";
import {
    evalMethod
} from "../../controller/retrieve";

const directiveOnInit = function (directive, node) {
    const method = evalMethod(directive.content, node);

    bindEvent(node.$element, directive.opt, e => method.val.apply(method.node.data, [...method.args, e]));

    return true;
};

export {
    directiveOnInit
};
