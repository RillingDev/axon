"use strict";

import {
    isDefined
} from "lightdash";
import {
    DOM_PROP_VALUE,
    DOM_PROP_TEXT,
    DOM_PROP_HTML,
    DOM_ATTR_HIDDEN
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

const setElementActive = (element, mode) => mode ? element.removeAttribute(DOM_ATTR_HIDDEN) : element.setAttribute(DOM_ATTR_HIDDEN, true);

export {
    getElementContentProp,
    setElementActive
};
