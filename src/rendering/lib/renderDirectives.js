"use strict";

const renderDirectives = function(ctrl) {
    ctrl.$directives.forEach(directive => {
        directive.forEach(directiveInstance => {
            directiveInstance.instanceOf.onRender(directiveInstance.node, ctrl, directiveInstance.data);
        });
    });
};

export default renderDirectives;
