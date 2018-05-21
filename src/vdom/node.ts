import { isArray } from "lightdash";
import { hasDirectives, parseDirectives } from "../dom/directive";
import { EDirectiveFn } from "../enums";
import {
    IAxonApp,
    IAxonDirective,
    IAxonDirectiveDeclaration,
    IAxonNode
} from "../interfaces";
import { bindDeepDataProxy } from "./proxy";

/**
 * Recursively flattens an array.
 *
 * @param {any[]} arr
 * @returns {any[]}
 * @example
 * arrFlattenDeep([1, 2, [3]])
 * // => [1, 2, 3]
 *
 * arrFlattenDeep([1, 2, [3, [[[5]]], [6, [6]]])
 * // => [1, 2, 3, 5, 6, 6]
 */
const arrFlattenDeep = (arr: any[]): any[] => {
    const result: any[] = [];

    arr.forEach(val => {
        if (isArray(val)) {
            result.push(...arrFlattenDeep(val));
        } else {
            result.push(val);
        }
    });

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
const mapSubNodes = (
    $app: IAxonApp,
    children: HTMLCollection,
    node: IAxonNode
): IAxonNode[] =>
    arrFlattenDeep(
        Array.from(children)
            // @ts-ignore
            .map((child: HTMLElement) => {
                if (hasDirectives(child)) {
                    // -> Recurse
                    return new AxonNode($app, child, node);
                } else if (child.children.length > 0) {
                    // -> Enter Children
                    return mapSubNodes($app, child.children, node);
                }

                // -> Exit dead-end
                return null;
            })
            .filter((val: IAxonNode | null) => val)
    );

/**
 * Axon Node
 *
 * @private
 * @class
 */
const AxonNode = class implements IAxonNode {
    public $app: IAxonApp;
    public $parent: IAxonNode | null;
    public $element: HTMLElement;
    public $children: IAxonNode[];

    public directives: IAxonDirective[];
    public data: object;
    /**
     * Axon Element Node Constructor
     *
     * @constructor
     * @param {HTMLElement} $element
     * @param {Element|null} $parent
     * @param {Object} [data={}]
     */
    constructor(
        $app: IAxonApp,
        $element: HTMLElement,
        $parent: IAxonNode | null,
        data: object = {}
    ) {
        const dataStorage = data;

        this.directives = parseDirectives($element);
        this.data = bindDeepDataProxy(dataStorage, this);

        this.$app = $app;
        this.$element = $element;
        this.$parent = $parent;
        this.$children = mapSubNodes($app, $element.children, this);
    }
    /**
     * Runs directives on the node and all sub-nodes
     *
     * @private
     * @param {0|1} directiveFnId
     * @returns {Array|false}
     */
    public run(directiveFnId: EDirectiveFn): boolean {
        const directiveResults = this.directives.map(
            (directive: IAxonDirective) => {
                if (this.$app.directives.has(directive.name)) {
                    const mapDirectiveEntry = this.$app.directives.get(
                        directive.name
                    );
                    const mapDirectiveEntryFn = (mapDirectiveEntry as IAxonDirectiveDeclaration)[
                        directiveFnId
                    ];

                    if (mapDirectiveEntryFn) {
                        return mapDirectiveEntryFn(
                            directive,
                            this.$element,
                            this
                        );
                    }
                }

                // Ignore non-existent directive types
                return true;
            }
        );

        // Recurse if all directives return true
        if (
            directiveResults.every(
                (directiveResult: boolean) => directiveResult
            )
        ) {
            this.$children.forEach(child => child.run(directiveFnId));

            return true;
        }

        return false;
    }
};

export { AxonNode };
