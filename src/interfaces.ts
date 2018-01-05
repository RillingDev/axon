import {
    DIRECTIVE_KEY_INIT,
    DIRECTIVE_KEY_RENDER
} from "./constants";

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
 * Needs to be manually updated with the values of DIRECTIVE_KEY_INIT and DIRECTIVE_KEY_RENDER
 */
interface IAxonDirectiveDeclaration extends IGenericObject {
    [0]?: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
    [1]?: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
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
