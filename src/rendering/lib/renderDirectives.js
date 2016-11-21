"use strict";

const renderDirectives = function(ctrl) {
    console.log("RENDER");

    ctrl.$directives.forEach(directive => {
        directive.forEach(directiveInstance => {
            directiveInstance.instanceOf.onRender(directiveInstance.node, ctrl, directiveInstance.data);
        });
    });
};

export default renderDirectives;
