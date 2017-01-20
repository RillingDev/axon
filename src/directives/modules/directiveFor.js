"use strict";

import evaluateExpression from "../../controller/evaluateExpression";
import {
    DOM_ATTR_PREFIX
} from "../../lib/constants";

const directiveForInit = function (node, directive,instanceData) {
    const splitExpression = directive.val.split(" ");
    const data = {
        val: splitExpression[0],
        in: evaluateExpression(instanceData, splitExpression[2])
    };

    directive.data = data;
    console.log("FOR INIT", data);

    return true;
};

const directiveForRender = function (node, directive,instanceData) {
    const attr_clone = DOM_ATTR_PREFIX + "clone";
    const iterable = directive.data.in;
    const parent = node.parentNode;
    const parentChildren = Array.from(parent.children);

    //Clear old clones
    parentChildren.forEach(child => {
        if (child.hasAttribute(attr_clone)) {
            child.remove();
        }
    });
    //Add new clones
    iterable.forEach((item, index) => {
        if (index > 0) {
            const clone = node.cloneNode(true);

            clone.setAttribute(attr_clone, true);
            parent.appendChild(clone);
        }
    });

    console.log("FOR RENDER", node);

    return true;
};

export {
    directiveForInit,
    directiveForRender
};
