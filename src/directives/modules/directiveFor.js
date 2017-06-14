"use strict";

import {
    retrieveProp
} from "../../controller/retrieve";
import {
    hasDirective,
    removeDirective,
    setDirective
} from "../../dom/directive";
import {
    cloneArray,
} from "../../util";
import {
    setElementActive
} from "../../dom/element";


const DOM_DIR_FOR_BASE = "for-base";
const DOM_DIR_FOR_DYNAMIC = "for-dyn";

const cleanDirectiveDyns = function (parent) {
    cloneArray(parent.children).forEach(child => {
        console.log([child, hasDirective(child, DOM_DIR_FOR_DYNAMIC)]);
        if (hasDirective(child, DOM_DIR_FOR_DYNAMIC)) {
            child.remove();
        }
    });
};

const directiveForInit = function (directive, node) {
    const element = node._element;

    setDirective(node._element, DOM_DIR_FOR_BASE, true);
    setElementActive(element, false);

    return false;
};

const directiveForRender = function (directive, node, AxonNode) {
    const element = node._element;
    const directiveSplit = directive.val.split(" ");
    const iteratorKey = directiveSplit[0];
    const iterable = retrieveProp(directiveSplit[2], node).val;
    const nodesNew = [];


    cleanDirectiveDyns(element.parentElement);

    for (let i of iterable) {
        const nodeElement = element.cloneNode(true);
        const nodeData = Object.assign({}, node.data);
        let elementInserted;

        setDirective(nodeElement, DOM_DIR_FOR_DYNAMIC, true);
        removeDirective(nodeElement, DOM_DIR_FOR_BASE);
        removeDirective(nodeElement, "for");
        setElementActive(nodeElement, true);

        nodeData[iteratorKey] = i;
        elementInserted = element.insertAdjacentElement("afterend", nodeElement);

        nodesNew.push(new AxonNode(elementInserted, node._parent, nodeData));
    }

    console.log({
        nodesNew,
    });

    node._children = nodesNew;

    return true;
};

export {
    directiveForInit,
    directiveForRender
};
