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

const DOM_DIR_DYN = "dyn";

const cleanDirectiveDyns = function (parent) {
    cloneArray(parent.children).forEach(child => {
        console.log([child, hasDirective(child, DOM_DIR_DYN)]);
        if (hasDirective(child, DOM_DIR_DYN)) {
            child.remove();
        }
    });
};

const directiveForRender = function (directive, node, AxonNode) {
    const directiveSplit = directive.val.split(" ");
    const iteratorKey = directiveSplit[0];
    const iterable = retrieveProp(directiveSplit[2], node).val;
    const nodesNew = [];
    const element = node._element;

    cleanDirectiveDyns(element.parentElement);

    for (let i of iterable) {
        const nodeElement = element.cloneNode();
        const nodeData = Object.assign({}, node.data);

        setDirective(nodeElement, DOM_DIR_DYN, true);
        removeDirective(nodeElement, "for");

        nodeData[iteratorKey] = i;

        nodesNew.push(new AxonNode(element.appendChild(nodeElement), node._parent, nodeData));
    }

    console.log({
        element,
        nodesNew,
    });

    node._children = nodesNew;

    return true;
};

export {
    directiveForRender
};
