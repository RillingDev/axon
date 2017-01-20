"use strict";

/**
 * @private
 * @param {Mixed} val Value to check
 * @returns {Boolean} if the value is defined
 */
const isDefined = function (val) {
    return typeof val !== "undefined";
};

export default isDefined;
