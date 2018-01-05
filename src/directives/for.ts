import { AxonNode } from "../vdom/node";
import {
    evalProp
} from "../vdom/controller";
import {
    hasDirective,
    removeDirective,
    setDirective
} from "../dom/directive";
import {
    forEach,
    arrFrom,
    objFrom,
} from "lightdash";
import {
    setElementActive
} from "../dom/element";
import { IAxonDirective, IAxonNode } from "../interfaces";
import {
    EDirectiveFn
} from "../enums";

const DOM_DIR_FOR_BASE = "forbase";
const DOM_DIR_FOR_DYNAMIC = "dyn";
const FOR_REGEX_ARR = /(.+) of (.+)/;

/**
 * v-for init directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveForInit = (directive: IAxonDirective, element: HTMLElement) => {
    setDirective(element, DOM_DIR_FOR_BASE, DOM_DIR_FOR_BASE);
    setElementActive(element, false);

    return false;
};

/**
 * v-for render directive
 *
 * @param {Object} directive
 * @param {Element} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveForRender = (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => {
    const directiveSplit = directive.content.match(FOR_REGEX_ARR);
    // @ts-ignore
    const iteratorKey = directiveSplit[1];
    // @ts-ignore
    const iterable = evalProp(directiveSplit[2], node).val;

    node.$children = [];

    // Delete old nodes
    // @ts-ignore
    forEach(arrFrom(element.parentElement.children), (child: HTMLElement) => {
        if (hasDirective(child, DOM_DIR_FOR_DYNAMIC)) {
            child.remove();
        }
    });

    for (const i of iterable) {
        // @ts-ignores
        const nodeElement: HTMLElement = element.cloneNode(true);
        const nodeData = objFrom(node.data);

        setDirective(nodeElement, DOM_DIR_FOR_DYNAMIC, DOM_DIR_FOR_DYNAMIC);
        removeDirective(nodeElement, DOM_DIR_FOR_BASE);
        removeDirective(nodeElement, "for");
        setElementActive(nodeElement, true);

        // @ts-ignore
        nodeData[iteratorKey] = i;

        const elementInserted = element.insertAdjacentElement("beforebegin", nodeElement);

        // Creates AxonNode for the new element and adds to node children
        // @ts-ignore
        const nodeNew = new AxonNode(node.$app, elementInserted, node.$parent, nodeData);

        node.$children.push(nodeNew);
        nodeNew.run(EDirectiveFn.init);
    }

    return true;
};

export {
    directiveForInit,
    directiveForRender
};
