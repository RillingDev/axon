interface IGenericObject {
    [key: string]: any;
}

interface IAxonConfig {
    el: HTMLElement;
    data?: object;
    methods?: object;
}

interface IAxonDirective {
    name: string;
    content: string;
    opt: string;
}

interface IAxonDirectiveDeclaration extends IGenericObject {
    init?: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
    render?: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
}

interface IAxonNode {
    $parent: IAxonNode | null;
    $element: HTMLElement;
    $children: IAxonNode[];

    directives: IAxonDirective[];
    data: object;

    run(type: PropertyKey): boolean;
}

interface IAxonNodeRoot extends IAxonNode {
    methods: object;

    init(): boolean;
    render(): boolean;
}

export { IAxonNode, IAxonNodeRoot, IAxonConfig, IAxonDirective, IAxonDirectiveDeclaration, IGenericObject };
