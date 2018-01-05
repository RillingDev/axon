import { IAxonNode, IAxonDirective, IAxonConfig } from "./interfaces";
declare const AxonNodeRoot: {
    new (cfg: IAxonConfig): {
        methods: object;
        init(): boolean;
        render(): boolean;
        $parent: IAxonNode;
        $element: HTMLElement;
        $children: IAxonNode[];
        directives: IAxonDirective[];
        data: object;
        run(type: PropertyKey): boolean;
    };
};
export default AxonNodeRoot;
