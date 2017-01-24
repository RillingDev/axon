"use strict";

import evaluateExpression from "../../controller/evaluateExpression";
import getDomMap from "../../dom/getDomMap";
import {
    DOM_ATTR_PREFIX
} from "../../lib/constants";

const directiveForInit = function (node, directive, instanceContent) {
    const splitExpression = directive.val.split(" ");
    const data = {
        val: splitExpression[0],
        in: evaluateExpression(instanceContent, splitExpression[2])
    };

    directive.data = data;

    return true;
};

const directiveForRender = function (node, directive, instanceContent, instanceMethods,mapNodes) {
    const attr_clone = DOM_ATTR_PREFIX + "clone";
    const iterable = directive.data.in;
    const parent = node.parentNode;
    const parentChildren = Array.from(parent.children);
    const newMap=Object.assign({},mapNodes.parent);
    let nodeMap;


console.log("nm",newMap);

    //Clear old clones
    parentChildren.forEach(child => {
        if (child.hasAttribute(attr_clone)) {
            child.remove();
        }
    });
    //Add new clones
    iterable.forEach((item, index) => {
        let currentNode;

        if (index === 0) {
            currentNode = node;
        } else {
            const clone = node.cloneNode(true);

            clone.setAttribute(attr_clone, true);
            parent.appendChild(clone);
            currentNode = clone;
        }
    });

   // nodeMap = getDomMap(parent);
    //instanceMethods.$render(nodeMap);

    return true;
};

export {
    directiveForInit,
    directiveForRender
};
