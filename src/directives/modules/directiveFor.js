"use strict";

import evaluateExpression from "../../controller/evaluateExpression";
import arrayFrom from "../../lib/arrayFrom";

const directiveForInit = function (instance, node, directive) {
    const splitExpression = directive.val.split(" ");
    const data = {
        val: splitExpression[0],
        in: evaluateExpression(instance, splitExpression[2])
    };

    directive.data = data;
    console.log("FOR INIT", data);

    return true;
};

const directiveForRender = function (instance, node, directive) {
    const iterable=directive.data.in;
    const clone=node.cloneNode();
    const parent = node.parentNode;
    const nodeChildren = arrayFrom(parent.children);
    
    nodeChildren.forEach(node=>{
        parent.removeChild(node);
    });
    iterable.forEach(node=>{
        parent.appendChild(clone);
    });

    node=parent.children[0];

    console.log("FOR RENDER", node);

    return true;
};

export {
    directiveForInit,
    directiveForRender
};
