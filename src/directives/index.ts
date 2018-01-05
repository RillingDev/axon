import {
    mapFromObject
} from "lightdash";
import {
    directiveModelInit,
    directiveModelRender
} from "./model";
import {
    directiveBindRender
} from "./bind";
import {
    directiveForInit,
    directiveForRender
} from "./for";
import {
    directiveTextRender
} from "./text";
import {
    directiveHTMLRender
} from "./html";
import {
    directiveIfBoth
} from "./if";
import {
    directiveOnInit
} from "./on";
import { IAxonDirectiveDeclaration } from "../interfaces";
import {
    DIRECTIVE_KEY_INIT,
    DIRECTIVE_KEY_RENDER
} from "../constants";

const directives: Map<string, IAxonDirectiveDeclaration> = mapFromObject({
    "if": {
        [DIRECTIVE_KEY_INIT]: directiveIfBoth,
        [DIRECTIVE_KEY_RENDER]: directiveIfBoth
    },
    "on": {
        [DIRECTIVE_KEY_INIT]: directiveOnInit,
    },
    "model": {
        [DIRECTIVE_KEY_INIT]: directiveModelInit,
        [DIRECTIVE_KEY_RENDER]: directiveModelRender
    },
    "bind": {
        [DIRECTIVE_KEY_RENDER]: directiveBindRender
    },
    "text": {
        [DIRECTIVE_KEY_RENDER]: directiveTextRender
    },
    "html": {
        [DIRECTIVE_KEY_RENDER]: directiveHTMLRender
    },
    "for": {
        [DIRECTIVE_KEY_INIT]: directiveForInit,
        [DIRECTIVE_KEY_RENDER]: directiveForRender
    }
});

export default directives;
