/**
 * addEventListener shorthand
 *
 * @private
 * @param {Element} node
 * @param {string} eventType
 * @param {Function} eventFn
 */
const bindEvent = (element: any, eventType: any, eventFn: any) => element.addEventListener(eventType, eventFn);

export {
    bindEvent
};
