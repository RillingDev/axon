"use strict";


/**
 * Binds event to dom
 *
 * @private
 * @param {NodeList} domList The Elements to bind
 * @param {String} type The Event type
 * @param {Function} fn The Even function
 * @return {Array} Returns Array of events
 */
export default function(domList, type, fn) {
    const result = [];

    [].forEach.call(domList, dom => {
        result.push(dom.addEventListener(type, fn, false));
    });

    return result;
}
