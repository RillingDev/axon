import { IAxonDirectiveDeclaration } from "../interfaces";
/**
 * Some of the directive keys are reserved words.
 *
 * should work fine, but be careful.
 *
 * @private
 */
declare const directives: Map<string, IAxonDirectiveDeclaration>;
export default directives;
