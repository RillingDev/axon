"use strict";

/**
 * Create a new array with the same contents
 * @param {Array} arr
 * @returns {Array}
 */
const cloneArray = arr => Array.from(arr);

/**
 * Checks if type is array
 * @param {Array} arr
 * @returns {Boolean}
 */
const isArray = arr => Array.isArray(arr);

/**
 * Flatten Array Recursively
 * @param {Array} arr
 * @returns {Array}
 */
const flattenArray = function (arr) {
    const result = [];

    arr.forEach(item => {
        if (isArray(item)) {
            result.push(...flattenArray(item));
        } else {
            result.push(item);
        }
    });

    return result;
};

/**
 * Maps an Array and removes null-elements
 * @param {Array} arr
 * @param {Function} fn
 * @returns {Array}
 */
const mapFilter = (arr, fn) => arr.map(fn).filter(val => val !== null);

export {
    cloneArray,
    isArray,
    flattenArray,
    mapFilter
};
