import { mapFromObject } from "lightdash";
import { EDirectiveFn } from "../enums";
import { IAxonDirectiveDeclaration } from "../interfaces";
import { directiveBindRender } from "./bind";
import { directiveForInit, directiveForRender } from "./for";
import { directiveHTMLRender } from "./html";
import { directiveIfRender } from "./if";
import { directiveModelInit, directiveModelRender } from "./model";
import { directiveOnInit } from "./on";
import { directiveTextRender } from "./text";

/**
 * Some of the directive keys are reserved words.
 *
 * should work fine, but be careful.
 *
 * @private
 */
const directives = mapFromObject({
    if: {
        [EDirectiveFn.render]: directiveIfRender
    },
    on: {
        [EDirectiveFn.init]: directiveOnInit
    },
    model: {
        [EDirectiveFn.init]: directiveModelInit,
        [EDirectiveFn.render]: directiveModelRender
    },
    bind: {
        [EDirectiveFn.render]: directiveBindRender
    },
    text: {
        [EDirectiveFn.render]: directiveTextRender
    },
    html: {
        [EDirectiveFn.render]: directiveHTMLRender
    },
    for: {
        [EDirectiveFn.init]: directiveForInit,
        [EDirectiveFn.render]: directiveForRender
    }
}) as Map<string, IAxonDirectiveDeclaration>;

export default directives;
