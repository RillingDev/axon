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
/*import {
    directiveForInit,
    directiveForRender
} from "./modules/directiveFor";*/

const directives = [{
        name: "ignore",
        init: directiveIgnoreBoth, //Init function
        render: directiveIgnoreBoth //Render function
    }, {
        name: "if",
        render: directiveIfRender
    },
    {
        name: "on",
        init: directiveOnInit,
    },
    {
        name: "model",
        init: directiveModelInit,
        render: directiveModelRender
    },
    {
        name: "bind",
        render: directiveBindRender
    },
    /*{
        name: "for",
        init: directiveForInit,
        render: directiveForRender
    }*/
];


export default directives;
