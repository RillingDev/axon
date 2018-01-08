/**
 * addEventListener shorthand
 *
 * @private
 * @param {Element} node
 * @param {string} eventType
 * @param {Function} eventFn
 */
const bindEvent = (element: HTMLElement, eventType: string, eventFn: (e: Event) => void) =>
    element.addEventListener(eventType, eventFn);

/**
 * Detects wether an input element uses the input ot change event
 *
 * https://developer.mozilla.org/en-US/docs/Web/Events/input
 *
 * @param {HTMLElement} element
 * @returns {string}
 */
const getEventType = (element: HTMLElement): string =>
    // @ts-ignore
    element.type === "checkbox" || element.type === "radio" ?
        "change" :
        "input";

export {
    bindEvent,
    getEventType
};
