"use strict";

import {isDefined} from "../util";
import {DOM_PROP_VALUE, DOM_PROP_TEXT, DOM_PROP_HTML} from "../constants";

const getNodeContentProp = function (node) {
    if (isDefined(node[DOM_PROP_VALUE])) {
        return DOM_PROP_VALUE;
    } else if (isDefined(node[DOM_PROP_TEXT])) {
        return DOM_PROP_TEXT;
    } else {
        return DOM_PROP_HTML;
    }
};

export default getNodeContentProp;
