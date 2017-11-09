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

const directives = mapFromObject({
    if: {
        init: directiveIfBoth,
        render: directiveIfBoth
    },
    on: {
        init: directiveOnInit,
    },
    model: {
        init: directiveModelInit,
        render: directiveModelRender
    },
    bind: {
        render: directiveBindRender
    },
    text: {
        render: directiveTextRender
    },
    html: {
        render: directiveHTMLRender
    },
    for: {
        init: directiveForInit,
        render: directiveForRender
    }
});

export default directives;
