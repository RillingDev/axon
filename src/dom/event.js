/**
 * addEventListener shorthand
 *
 * @private
 * @param {Element} node
 * @param {string} eventType
 * @param {Function} eventFn
 */
const bindEvent = (element, eventType, eventFn) => element.addEventListener(eventType, eventFn);

export {
    bindEvent
};
