import { IAxonNode, IAxonApp, IAxonDirective } from "../interfaces";
import { EDirectiveFn } from "../enums";
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
