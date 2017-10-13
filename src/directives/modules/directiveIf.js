import {
    evalDirective
} from "../../controller/retrieve";
import {
    setElementActive
} from "../../dom/element";

const directiveIfBoth = function (directive, node) {
    const element = node.$element;
    const expressionValue = Boolean(evalDirective(directive.content, node, true).val);

    setElementActive(element, expressionValue);

    return expressionValue;
};

export {
    directiveIfBoth
};
