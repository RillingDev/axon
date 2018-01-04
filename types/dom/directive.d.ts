import { IAxonDirective } from "../interfaces";
declare const setDirective: (element: HTMLElement, key: string, value: string) => void;
declare const getDirective: (element: HTMLElement, key: string) => string;
declare const hasDirective: (element: HTMLElement, key: string) => boolean;
declare const removeDirective: (element: HTMLElement, key: string) => void;
declare const getDirectives: (element: HTMLElement) => Attr[];
declare const hasDirectives: (element: HTMLElement) => boolean;
declare const parseDirectives: (element: HTMLElement) => IAxonDirective[];
export { setDirective, getDirective, hasDirective, removeDirective, getDirectives, hasDirectives, parseDirectives };
