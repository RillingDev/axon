"use strict";

/**
 * Creates typeList entry for module
 *
 * @private
 * @param {Object} _this The context
 * @return void
 */
export default function (data, val) {
    return document.querySelectorAll(`[xn-${data}='${val}']`);
}
