import { IAxonNode, IAxonDirective } from "../interfaces";
declare const AxonNode: {
    new ($element: HTMLElement, $parent: IAxonNode, data?: object): {
        $parent: IAxonNode;
        $element: HTMLElement;
        $children: IAxonNode[];
        directives: IAxonDirective[];
        data: object;
        run(type: string): boolean;
        init(): boolean;
        render(): boolean;
    };
};
export default AxonNode;
