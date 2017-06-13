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
        if (hasDirective(child, DOM_DIR_DYN)) {
            child.remove();
        }
    });
};

const directiveForRender = function (directive, node) {
    const directiveSplit = directive.val.split(" ");
    const iteratorKey = directiveSplit[0];
    const iterable = retrieveProp(directiveSplit[2], node).val;
    const nodesNew = [];
    const element = node._element;

    cleanDirectiveDyns(element.parentElement);

    for (let i of iterable) {
        const nodeI = Object.assign({}, node);

        nodeI[iteratorKey] = i;

        nodesNew.push(nodeI);
    }

    console.log({
        element,
        nodesNew,
    });

    nodesNew.forEach(nodeNew => {
        const elementNew = element.cloneNode();

        setDirective(elementNew, DOM_DIR_DYN, true);
        removeDirective(elementNew, "for");

        nodeNew._element = element.appendChild(elementNew);
    });

    //node._children = nodesNew;

    return true;
};

export {
    directiveForRender
};
