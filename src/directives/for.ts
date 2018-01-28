import { AxonNode } from "../vdom/node";
import { evalProp } from "../vdom/controller";
import { hasDirective, removeDirective, setDirective } from "../dom/directive";
import { forEach, arrFrom, objFrom } from "lightdash";
import { setElementActive } from "../dom/element";
import { IAxonDirective, IAxonNode } from "../interfaces";
import { EDirectiveFn } from "../enums";

const DOM_DIR_FOR_BASE = "forbase";
const DOM_DIR_FOR_DYNAMIC = "dyn";
const FOR_REGEX_ARR = /(.+) of (.+)/;

/**
 * v-for init directive
 *
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
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
 * @private
 * @param {Object} directive
 * @param {HTMLElement} element
 * @param {AxonNode} node
 * @returns {boolean}
 */
const directiveForRender = (
    directive: IAxonDirective,
    element: HTMLElement,
    node: IAxonNode
) => {
    const directiveSplit = <RegExpMatchArray>directive.content.match(
        FOR_REGEX_ARR
    );
    const iteratorKey = directiveSplit[1];
    const iterable = evalProp(directiveSplit[2], node).val;

    node.$children = [];

    // Delete old nodes
    forEach(
        arrFrom((<HTMLElement>element.parentElement).children),
        // @ts-ignore
        (child: HTMLElement) => {
            if (hasDirective(child, DOM_DIR_FOR_DYNAMIC)) {
                child.remove();
            }
        }
    );

    for (const i of iterable) {
        const nodeElement: HTMLElement = <HTMLElement>element.cloneNode(true);
        const nodeData: { [key: string]: any } = objFrom(node.data);

        setDirective(nodeElement, DOM_DIR_FOR_DYNAMIC, DOM_DIR_FOR_DYNAMIC);
        removeDirective(nodeElement, DOM_DIR_FOR_BASE);
        removeDirective(nodeElement, "for");
        setElementActive(nodeElement, true);

        nodeData[iteratorKey] = i;

        const elementInserted = <HTMLElement>element.insertAdjacentElement(
            "beforebegin",
            nodeElement
        );

        // Creates AxonNode for the new element and adds to node children
        const nodeNew = new AxonNode(
            node.$app,
            elementInserted,
            node.$parent,
            nodeData
        );

        node.$children.push(nodeNew);
        nodeNew.run(EDirectiveFn.init);
    }

    return true;
};

export { directiveForInit, directiveForRender };
