"use strict";

import {
    isDefined
} from "../util";
import {
    DOM_PROP_VALUE,
    DOM_PROP_TEXT,
    DOM_PROP_HTML
} from "../constants";

/**
 * Checks which type of content property an Element uses
 * @param {Element} element
 * @returns {String}
 */
const getElementContentProp = function (element) {
    if (isDefined(element[DOM_PROP_VALUE])) {
        return DOM_PROP_VALUE;
    } else if (isDefined(element[DOM_PROP_TEXT])) {
        return DOM_PROP_TEXT;
    } else {
        return DOM_PROP_HTML;
    }
};

export {
    getElementContentProp
};
