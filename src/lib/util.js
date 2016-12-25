"use strict";

/**
 * iterate over NodeList
 *
 * @private
 * @param {NodeList} nodeList The nodeList to iterate over
 * @param {Function} fn The Function to call
 * @returns void
 */
export function eachNode(nodeList, fn) {
    const l = nodeList.length;
    let i = 0;

    while (i < l) {
        fn(nodeList[i], i);
        i++;
    }
}

/**
 * Iterate over Object
 *
 * @private
 * @param {Object} object The Object to iterate over
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
