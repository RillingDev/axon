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
        run(directiveFnId: EDirectiveFn): boolean;
    };
};
export { AxonNode };
