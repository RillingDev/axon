import {
    hasKey
} from "lightdash";
import {
    DOM_PROP_VALUE,
    DOM_PROP_TEXT,
    DOM_PROP_HTML,
    DOM_ATTR_HIDDEN
} from "../constants";

/**
 * Checks which type of content property an Element uses
 *
 * @private
 * @param {Element} element
 * @returns {string}
 */
const getElementContentProp = (element: HTMLElement) => {
    // @ts-ignore
    if (hasKey(element, DOM_PROP_VALUE)) {
        return DOM_PROP_VALUE;
        // @ts-ignore
    } else if (hasKey(element, DOM_PROP_TEXT)) {
        return DOM_PROP_TEXT;
    } else {
        return DOM_PROP_HTML;
    }
};

/**
 * Toggles element active mode
 *
 * @private
 * @param {Element} element
 * @param {boolean} active
 */
const setElementActive = (element: HTMLElement, active: boolean) => active ?
    element.removeAttribute(DOM_ATTR_HIDDEN) :
    element.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);

export {
    getElementContentProp,
    setElementActive
};
