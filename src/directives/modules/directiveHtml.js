import {
    retrieveExpression
} from "../../controller/retrieve";
import {
    DOM_PROP_HTML
} from "../../constants";

const directiveHTMLRender = function (directive, node) {
    node.$element[DOM_PROP_HTML] = String(retrieveExpression(directive.content, node).val);

    return true;
};

export {
    directiveHTMLRender
};
