/**
 * addEventListener shorthand
 *
 * @private
 * @param {Element} node
 * @param {string} eventType
 * @param {Function} eventFn
 */
declare const bindEvent: (element: HTMLElement, eventType: string, eventFn: (e: Event) => void) => void;
/**
 * Detects wether an input element uses the input ot change event
 *
 * https://developer.mozilla.org/en-US/docs/Web/Events/input
 *
 * @param {HTMLElement} element
 * @returns {string}
 */
declare const getEventType: (element: HTMLElement) => string;
export { bindEvent, getEventType };
