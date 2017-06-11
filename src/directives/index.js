"use strict";

import {
    directiveModelInit,
    directiveModelRender
} from "./modules/directiveModel";
import {
    directiveBindRender
} from "./modules/directiveBind";
import {
    directiveTextRender
} from "./modules/directiveText";
import {
    directiveHTMLRender
} from "./modules/directiveHTML";
import {
    directiveIfRender
} from "./modules/directiveIf";
import {
    directiveOnInit
} from "./modules/directiveOn";

const directives = {
    "model": {
        init: directiveModelInit,
        render: directiveModelRender
    },
    "bind": {
        render: directiveBindRender
    },
    "text": {
        render: directiveTextRender
    },
    "html": {
        render: directiveHTMLRender
    },
    "if": {
        render: directiveIfRender
    },
    "on": {
        init: directiveOnInit,
    },
};


export default directives;
