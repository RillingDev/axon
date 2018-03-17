import { isUndefined } from "lightdash";
import {
    DOM_ATTR_HIDDEN,
    DOM_PROP_CHECKED,
    DOM_PROP_HTML,
    DOM_PROP_TEXT,
    DOM_PROP_VALUE
} from "../constants";

/**
 * addEventListener shorthand
 *
 * @private
 * @param {HTMLElement} node
 * @param {string} eventType
 * @param {Function} eventFn
 */
const bindEvent = (
    element: HTMLElement,
    eventType: string,
    eventFn: (e: Event) => void
) => element.addEventListener(eventType, eventFn);

/**
 * Checks if an element is a checkbox or a radio
 *
 * @private
 * @param {HTMLElement} element
 * @returns {boolean}
 */
const isCheckboxLike = (element: HTMLElement): boolean =>
    (element as HTMLInputElement).type === "checkbox" ||
    (element as HTMLInputElement).type === "radio";

/**
 * Detects wether an input element uses the input ot change event.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/Events/input
 *
 * @private
 * @param {HTMLElement} element
 * @returns {string}
 */
const getInputEventType = (element: HTMLElement): string =>
    isCheckboxLike(element) ? "change" : "input";

/**
 * Checks which type of content property an Element uses
 *
 * @private
 * @param {HTMLElement} element
 * @returns {string}
 */
const getElementContentProp = (element: HTMLElement): string => {
    if (!isUndefined(element[DOM_PROP_VALUE])) {
        return isCheckboxLike(element) ? DOM_PROP_CHECKED : DOM_PROP_VALUE;
    } else if (!isUndefined(element[DOM_PROP_TEXT])) {
        return DOM_PROP_TEXT;
    }

    return DOM_PROP_HTML;
};

/**
 * Toggles element active mode
 *
 * @private
 * @param {HTMLElement} element
 * @param {boolean} active
 */
const setElementActive = (element: HTMLElement, active: boolean) =>
    active
        ? element.removeAttribute(DOM_ATTR_HIDDEN)
        : element.setAttribute(DOM_ATTR_HIDDEN, DOM_ATTR_HIDDEN);

export {
    bindEvent,
    getElementContentProp,
    getInputEventType,
    isCheckboxLike,
    setElementActive
};
