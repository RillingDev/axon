/**
 * addEventListener shorthand
 *
 * @param {Element} node
 * @param {String} eventType
 * @param {Function} eventFn
 */
const bindEvent = function (element, eventType, eventFn) {
    element.addEventListener(eventType, eventFn);
};

export {
    bindEvent
};
