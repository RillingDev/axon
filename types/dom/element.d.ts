/**
 * addEventListener shorthand
 *
 * @private
 * @param {HTMLElement} node
 * @param {string} eventType
 * @param {Function} eventFn
 */
declare const bindEvent: (element: HTMLElement, eventType: string, eventFn: (e: Event) => void) => void;
/**
 * Checks if an element is a checkbox or a radio
 *
 * @private
 * @param {HTMLElement} element
 * @returns {boolean}
 */
declare const isCheckboxLike: (element: HTMLElement) => boolean;
/**
 * Detects wether an input element uses the input ot change event.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/Events/input
 *
 * @private
 * @param {HTMLElement} element
 * @returns {string}
 */
declare const getInputEventType: (element: HTMLElement) => string;
/**
 * Checks which type of content property an Element uses
 *
 * @private
 * @param {HTMLElement} element
 * @returns {string}
 */
declare const getElementContentProp: (element: HTMLElement) => string;
/**
 * Toggles element active mode
 *
 * @private
 * @param {HTMLElement} element
 * @param {boolean} active
 */
declare const setElementActive: (element: HTMLElement, active: boolean) => void;
export { bindEvent, getElementContentProp, getInputEventType, isCheckboxLike, setElementActive };
