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
 * @return void
 */
export function eachNode(NodeList, fn) {
    const l = NodeList.length;
    let i = 0;

    while (i < l) {
        fn(NodeList[i], i);
        i++;
    }
}
