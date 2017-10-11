import {
    retrieveExpression
} from "../../controller/retrieve";

const directiveBindRender = function (directive, node) {
    node.$element.setAttribute(directive.opt, retrieveExpression(directive.content, node).val);

    return true;
};

export {
    directiveBindRender
};
