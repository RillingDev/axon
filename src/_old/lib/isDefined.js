"use strict";

/**
 * @private
 * @param {Mixed} val Value to check
 * @returns {Boolean} if the value is defined
 */
const isDefined = val => typeof val !== "undefined";

export default isDefined;
