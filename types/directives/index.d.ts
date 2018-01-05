import { IAxonDirectiveDeclaration } from "../interfaces";
/**
 * Some of the directive keys are reserved words.
 * this 'should' work fine, but be careful
 */
declare const directives: Map<string, IAxonDirectiveDeclaration>;
export default directives;
