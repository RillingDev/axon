"use strict";

import {
    _document
} from "../../constants";
import constructQuery from "./constructQuery";

/**
 * Query multiple from DOM
 *
 * @private
 * @param {String} data The data id
 * @param {String} val The data value
 * @return {NodeList} Returns NodeList
 */
export default function(data, val) {
    return _document.querySelectorAll(constructQuery(data, val));
}
