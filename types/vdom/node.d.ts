import { EDirectiveFn } from "../enums";
import { IAxonApp, IAxonDirective, IAxonNode } from "../interfaces";
/**
 * Axon Node
 *
 * @private
 * @class
 */
declare const AxonNode: {
    new ($app: IAxonApp, $element: HTMLElement, $parent: IAxonNode | null, data?: object): {
        $app: IAxonApp;
        $parent: IAxonNode | null;
        $element: HTMLElement;
        $children: IAxonNode[];
        directives: IAxonDirective[];
        data: object;
        /**
         * Runs directives on the node and all sub-nodes
         *
         * @private
         * @param {0|1} directiveFnId
         * @returns {Array|false}
         */
        run(directiveFnId: EDirectiveFn): boolean;
    };
};
export { AxonNode };
