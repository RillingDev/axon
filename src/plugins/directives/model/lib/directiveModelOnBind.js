"use strict";

const directiveModelOnBind = function(ctrl) {
    /*const result = [];
    const elements = queryDirective("model", "*", context);

    bind(elements, "change", modelEvent);
    bind(elements, "input", modelEvent);

    eachNode(elements, (element, index) => {
        result.push({
            index,
            element,
            type: "model",
            value: readDirective(element, "model")
        });
    });

    return result;

    function modelEvent(ev, dom) {
        _window.setTimeout(() => {
            const content = dom.value;
            const modelFor = readDirective(dom, "model");

            console.log("MODEL:", modelFor, content);
            ctrl[modelFor] = content;

            digest(ctrl);
        }, 5);
    }*/

    return true;
};

export default directiveModelOnBind;
