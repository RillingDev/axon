import { IAxonDirective, IAxonNode } from "../interfaces";
declare const directiveForInit: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
declare const directiveForRender: (directive: IAxonDirective, element: HTMLElement, node: IAxonNode) => boolean;
export { directiveForInit, directiveForRender };
