import { IAxonNode, IAxonDirective, IAxonConfig } from "./interfaces";
declare const AxonNodeRoot: {
    new (cfg: IAxonConfig): {
        methods: object;
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
export default AxonNodeRoot;
