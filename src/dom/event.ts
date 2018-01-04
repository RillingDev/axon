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

export {
    bindEvent
};
