"use strict";

import {
    mapFromObject
} from "../util";
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
} from "./modules/directiveHTML";
import {
    directiveIfBoth
} from "./modules/directiveIf";
import {
    directiveOnInit
} from "./modules/directiveOn";

const directives = mapFromObject({
    "model": {
        _init: directiveModelInit,
        _render: directiveModelRender
    },
    "bind": {
        _render: directiveBindRender
    },
    "for": {
        _init: directiveForInit,
        _render: directiveForRender
    },
    "text": {
        _render: directiveTextRender
    },
    "html": {
        _render: directiveHTMLRender
    },
    "if": {
        _init: directiveIfBoth,
        _render: directiveIfBoth
    },
    "on": {
        _init: directiveOnInit,
    },
});


export default directives;
