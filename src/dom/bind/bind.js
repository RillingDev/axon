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
    //const result = {};
    let i = 0;

    [].forEach.call(domList, dom => {
        /*result[i] = */
        dom.addEventListener(type, ev => {
            return fn(ev, dom);
        }, false);

        i++;
    });

    return i;
}
