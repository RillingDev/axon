import {
    hasKey
} from "lightdash";
import {
    DOM_PROP_CHECKED,
    DOM_PROP_VALUE,
    DOM_PROP_TEXT,
    DOM_PROP_HTML,
    DOM_ATTR_HIDDEN
} from "../constants";

const DOM_PROPS = [DOM_PROP_CHECKED, DOM_PROP_VALUE, DOM_PROP_TEXT, DOM_PROP_HTML];
/**
 * Checks which type of content property an Element uses
 *
 * @private
 * @param {Element} element
 * @returns {string}
 */
const getElementContentProp = (element: HTMLElement) =>
    DOM_PROPS.find(prop => hasKey(element, prop));

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
