import {
    retrieveExpression
} from "../../controller/retrieve";
import {
    DOM_PROP_HTML
} from "../../constants";

const directiveHTMLRender = function (directive, node) {
    node._element[DOM_PROP_HTML] = String(retrieveExpression(directive._content, node)._val);

    return true;
};

export {
    directiveHTMLRender
};
