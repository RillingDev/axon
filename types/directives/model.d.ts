import { IAxonDirective, IAxonNode } from "../interfaces";
declare const directiveModelInit: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
declare const directiveModelRender: (directive: any, element: any, node: any) => boolean;
export { directiveModelInit, directiveModelRender };
