import {
    mapFromObject
} from "lightdash";
import {
    directiveModelInit,
    directiveModelRender
} from "./modules/directiveModel";
import {
    directiveBindRender
} from "./modules/directiveBind";
import {
    directiveForInit,
    directiveForRender
} from "./modules/directiveFor";
import {
    directiveTextRender
} from "./modules/directiveText";
import {
    directiveHTMLRender
} from "./modules/directiveHtml";
import {
    directiveIfBoth
} from "./modules/directiveIf";
import {
    directiveOnInit
} from "./modules/directiveOn";

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
