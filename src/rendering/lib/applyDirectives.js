"use strict";

const applyDirectives = function(ctrl) {
    ctrl.$directives.forEach(directive => {
        directive.forEach(directiveInstance => {
            directiveInstance.instanceOf.onApply(directiveInstance.node, ctrl, directiveInstance.data);
        });
    });
};

export default applyDirectives;
