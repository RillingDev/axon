import {
    evalDirective
} from "../../controller/retrieve";

const directiveBindRender = function (directive, node) {
    node.$element.setAttribute(directive.opt, evalDirective(directive.content, node).val);

    return true;
};

export {
    directiveBindRender
};
