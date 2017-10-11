import {
    retrieveProp
} from "../../controller/retrieve";
import {
    hasDirective,
    removeDirective,
    setDirective
} from "../../dom/directive";
import {
    forEach,
    arrClone,
} from "lightdash";
import {
    setElementActive
} from "../../dom/element";

const DOM_DIR_FOR_BASE = "forbase";
const DOM_DIR_FOR_DYNAMIC = "dyn";
const FOR_REGEX_ARR = /(\w+) in (\w+)/;

const directiveForInit = function (directive, node) {
    const element = node.$element;

    setDirective(node.$element, DOM_DIR_FOR_BASE, true);
    setElementActive(element, false);

    return false;
};

const directiveForRender = function (directive, node, AxonNode) {
    const element = node.$element;
    const directiveSplit = FOR_REGEX_ARR.exec(directive.content);
    const iteratorKey = directiveSplit[1];
    const iterable = retrieveProp(directiveSplit[2], node).val;
    const nodesNew = [];

    //Delete old nodes
    forEach(arrClone(element.parentElement.children), child => {
        if (hasDirective(child, DOM_DIR_FOR_DYNAMIC)) {
            child.remove();
        }
    });

    for (let i of iterable) {
        const nodeElement = element.cloneNode(true);
        const nodeData = Object.assign({}, node.data);
        let elementInserted;

        setDirective(nodeElement, DOM_DIR_FOR_DYNAMIC, true);
        removeDirective(nodeElement, DOM_DIR_FOR_BASE);
        removeDirective(nodeElement, "for");
        setElementActive(nodeElement, true);

        nodeData[iteratorKey] = i;
        elementInserted = element.insertAdjacentElement("beforebegin", nodeElement);

        nodesNew.push(new AxonNode(elementInserted, node.$parent, nodeData));
    }

    node.$children = nodesNew;

    return true;
};

export {
    directiveForInit,
    directiveForRender
};
