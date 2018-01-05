import { EDirectiveFn } from "./enums";

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

/**
 * Needs to be manually updated with the values of EDirectiveFn
 */
interface IAxonDirectiveDeclaration {
    0?: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
    1?: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
}

interface IAxonNode {
    $parent: IAxonNode | null;
    $element: HTMLElement;
    $children: IAxonNode[];

    directives: IAxonDirective[];
    data: object;

    run(directiveFnId: EDirectiveFn): boolean;
}

interface IAxonNodeRoot extends IAxonNode {
    methods: object;

    init(): boolean;
    render(): boolean;
}

export { IAxonNode, IAxonNodeRoot, IAxonConfig, IAxonDirective, IAxonDirectiveDeclaration, IGenericObject };
