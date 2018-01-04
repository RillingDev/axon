declare const applyMethodContext: (methodProp: any, additionalArgs?: any[]) => any;
declare const evalLiteralFromNode: (expression: any, node: any) => any;
declare const evalDirective: (name: any, node: any, allowUndefined?: boolean) => any;
declare const evalProp: (expression: any, node: any, allowUndefined?: boolean) => any;
declare const evalMethod: (expression: any, node: any, allowUndefined?: boolean) => any;
export { applyMethodContext, evalLiteralFromNode, evalDirective, evalMethod, evalProp };
