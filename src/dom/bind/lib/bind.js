"use strict";

import {
    eachNode
} from "../../util";

/**
 * Binds event to dom
 *
 * @private
 * @param {NodeList} domList The Elements to bind
 * @param {String} type The Event type
 * @param {Function} fn The Even function
 * @return void
 */
export default function(domList, type, fn) {
    eachNode(domList, dom => {
        dom.addEventListener(type, eventFn, false);

        function eventFn(ev) {
            return fn(ev, dom);
        }
    });
}
