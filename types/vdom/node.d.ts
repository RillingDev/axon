import { IAxonNode, IAxonNodeRoot, IAxonDirective } from "../interfaces";
import { EDirectiveFn } from "../enums";
/**
 * Gets the topmost node
 *
 * @private
 * @param {AxonNode} node
 * @returns {AxonNode}
 */
declare const getNodeRoot: (node: IAxonNode | IAxonNodeRoot) => IAxonNodeRoot;
/**
 * Axon Node
 *
 * @class
 */
declare const AxonNode: {
    new ($element: HTMLElement, $parent: IAxonNode, data?: object): {
        $parent: IAxonNode;
        $element: HTMLElement;
        $children: IAxonNode[];
        directives: IAxonDirective[];
        data: object;
        run(directiveFnId: EDirectiveFn): boolean;
    };
};
export { AxonNode, getNodeRoot };
