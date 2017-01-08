"use strict";

import directiveIgnore from "./directiveIgnore";
import directiveIf from "./directiveIf";
import directiveOn from "./directiveOn";
import directiveModel from "./directiveModel";
import directiveBind from "./directiveBind";

const directives = {
    ignore: directiveIgnore,
    if: directiveIf,
    on: directiveOn,
    model: directiveModel,
    bind: directiveBind
};

export default directives;
