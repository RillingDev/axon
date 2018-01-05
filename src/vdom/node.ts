import {
    arrFrom,
    arrFlattenDeep
} from "lightdash";
import {
    hasDirectives,
    parseDirectives
} from "../dom/directive";
import {
    bindDeepDataProxy
} from "./proxy";
import mapDirectives from "../directives/index";
import { IAxonNode, IAxonNodeRoot, IAxonDirective, IAxonDirectiveDeclaration } from "../interfaces";
import { EDirectiveFn } from "../enums";

/**
 * Gets the topmost node
 *
 * @private
 * @param {AxonNode} node
 * @returns {AxonNode}
 */
const getNodeRoot = (node: IAxonNode | IAxonNodeRoot): IAxonNodeRoot => {
    let result = node;

    while (result.$parent !== null) {
        result = result.$parent;
    }
    // @ts-ignore
    return result;
};

/**
 * Maps and processes Array of element children
 *
 * @private
 * @param {NodeList} children
 * @param {AxonNode} node
 * @returns {Array<Object>}
 */
const mapSubNodes = (children: HTMLCollection, node: IAxonNode): IAxonNode[] =>
    arrFlattenDeep(arrFrom(children)
        // @ts-ignore
        .map((child: HTMLElement) => {
            if (hasDirectives(child)) {
                // -> Recurse
                return new AxonNode(child, node);
            } else if (child.children.length > 0) {
                // -> Enter Children
                return mapSubNodes(child.children, node);
            } else {
                // -> Exit dead-end
                return null;
            }
        })
        .filter((val: IAxonNode | null) => val));

/**
 * Axon Node
 *
 * @class
 */
const AxonNode = class implements IAxonNode {
    public $parent: IAxonNode | null;
    public $element: HTMLElement;
    public $children: IAxonNode[];

    public directives: IAxonDirective[];
    public data: object;
    /**
     * Axon Element Node Constructor
     *
     * @constructor
     * @param {Element} $element
     * @param {Element|null} $parent
     * @param {Object} [data={}]
     */
    constructor($element: HTMLElement, $parent: IAxonNode | null, data: object = {}) {
        const dataStorage = data;

        this.directives = parseDirectives($element);
        this.data = bindDeepDataProxy(dataStorage, this);

        this.$element = $element;
        this.$parent = $parent;
        this.$children = mapSubNodes($element.children, this);
    }
    /**
     * Runs directives on the node and all sub-nodes
     *
     * @param {0|1} directiveFnId
     * @returns {Array|false}
     */
    public run(directiveFnId: EDirectiveFn): boolean {
        const directiveResults = this.directives
            .map((directive: IAxonDirective) => {
                if (mapDirectives.has(directive.name)) {
                    const mapDirectiveEntry = mapDirectives.get(directive.name);
                    // @ts-ignore
                    const mapDirectiveEntryFn = mapDirectiveEntry[directiveFnId];

                    if (mapDirectiveEntryFn) {
                        return mapDirectiveEntryFn(directive, this.$element, this);
                    }
                }

                // Ignore non-existent directive types
                return true;
            });

        // Recurse if all directives return true
        if (directiveResults.every((directiveResult: boolean) => directiveResult)) {
            this.$children.forEach((child) => child.run(directiveFnId));

            return true;
        } else {
            return false;
        }
    }
};

export { AxonNode, getNodeRoot };
