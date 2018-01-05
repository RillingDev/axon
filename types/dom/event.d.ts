/**
 * addEventListener shorthand
 *
 * @private
 * @param {Element} node
 * @param {string} eventType
 * @param {Function} eventFn
 */
declare const bindEvent: (element: HTMLElement, eventType: string, eventFn: (e: Event) => void) => void;
export { bindEvent };
