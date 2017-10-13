import {
    evalDirective
} from "../../controller/retrieve";
import {
    DOM_PROP_HTML
} from "../../constants";

const directiveHTMLRender = function (directive, node) {
    node.$element[DOM_PROP_HTML] = String(evalDirective(directive.content, node).val);

    return true;
};

export {
    directiveHTMLRender
};
