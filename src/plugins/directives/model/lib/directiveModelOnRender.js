"use strict";

import queryDirective from "../../../../dom/query/queryDirective";
import getDirectiveValue from "../../../../dom/lib/getDirectiveValue";
import bindEvent from "../../../../dom/bind/lib/bindEvent";

const directiveModelOnDigest = function(node, ctrl) {
    return true;
};

export default directiveModelOnDigest;
