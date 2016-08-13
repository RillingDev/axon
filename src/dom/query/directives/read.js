"use strict";

import {
    _domNameSpace
} from "../../constants";

/**
 * Read Data from element
 *
 * @private
 * @param {Node} element The Element to read
 * @param {String} data The data attr to read
 * @return {String} Returns value
 */
export default function(element, data) {
    return element.attributes[`${_domNameSpace}-${data}`].value;
}
