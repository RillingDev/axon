"use strict";

/**
 * Misc Utility functions
 */

/**
 * iterate over NoddeList
 *
 * @private
 * @param {NodeList} NodeList The Elements to bind
 * @param {Function} fn The Function to call
 * @returns void
 */
export function eachNode(NodeList, fn) {
    const l = NodeList.length;
    let i = 0;

    while (i < l) {
        fn(NodeList[i], i);
        i++;
    }
}
/**
 * Iterate object
 *
 * @private
 * @param {Object} object The Object to iterate
 * @param {Function} fn The Function to run
 * @returns void
 */
export function eachObject(object, fn) {
    const keys = Object.keys(object);
    const l = keys.length;
    let i = 0;

    while (i < l) {
        const currentKey = keys[i];

        fn(object[currentKey], currentKey, i);
        i++;
    }
}
/**
 * replace string at position
 *
 * @private
 * @param {String} string The String to exec
 * @param {String} find The String to find
 * @param {String} replace The String to replace
 * @param {Number} index The Index to start replacing
 * @returns {String} replacedString
 */
export function replaceFrom(string, find, replace, index) {
    return string.substr(0, index) + string.substr(index).replace(find, replace);
}
