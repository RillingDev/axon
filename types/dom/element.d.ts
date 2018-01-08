/**
 * Checks which type of content property an Element uses
 *
 * @private
 * @param {Element} element
 * @returns {string}
 */
declare const getElementContentProp: (element: HTMLElement) => string | undefined;
/**
 * Toggles element active mode
 *
 * @private
 * @param {Element} element
 * @param {boolean} active
 */
declare const setElementActive: (element: HTMLElement, active: boolean) => void;
export { getElementContentProp, setElementActive };
