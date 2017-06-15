"use strict";

import {
    isDefined
} from "../util";
import {
    retrieveProp
} from "./retrieve";

const REGEX_IS_NUMBER = /^[\d\.]+$/;
const REGEX_IS_STRING = /^'\w+'$/;

//@TODO make this less hacky
/**
 * Parses expression args to "real" values
 *  @param {String} arg
 * @param {Node} node
 * @returns {Mixed}
 */
const mapArg = function (arg, node) {
    if (REGEX_IS_NUMBER.test(arg)) {
        return Number(arg);
    } else if (REGEX_IS_STRING.test(arg)) {
        //Cut of braces
        return arg.substr(1, arg.length - 2);
    } else if (arg === "true") {
        return true;
    } else if (arg === "false") {
        return false;
    } else {
        return retrieveProp(arg, node)._val;
    }
};

/**
 * Finds a string-path as object property
 * @param {Object} obj
 * @param {String} path
 * @returns {Object|false}
 */
const findPath = function (obj, path) {
    const arr = path.split(".");
    let last = obj;
    let current;
    let index = 0;

    while (index < arr.length) {
        const currentPath = arr[index];

        current = last[currentPath];

        if (isDefined(current)) {
            if (index < arr.length - 1) {
                last = current;
            } else {
                return {
                    _val: current,
                    _container: last,
                    _key: currentPath
                };
            }
        }

        index++;
    }

    return false;
};

export {
    findPath,
    mapArg
};
