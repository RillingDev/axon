"use strict";

import {
    directiveIgnoreBoth
} from "./modules/directiveIgnore";
import {
    directiveIfRender
} from "./modules/directiveIf";
import {
    directiveOnInit
} from "./modules/directiveOn";
import {
    directiveModelInit,
    directiveModelRender
} from "./modules/directiveModel";
import {
    directiveBindRender
} from "./modules/directiveBind";

const directives = {
    ignore: {
        init: directiveIgnoreBoth, //Init function
        render: directiveIgnoreBoth //Render function
    },
    if: {
        render: directiveIfRender
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
    }
};

export default directives;
