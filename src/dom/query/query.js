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
 * @param {Node} context optional, query context
 * @return {NodeList} Returns NodeList
 */
export default function(data, val, context) {
    return (context ? context : _document).querySelectorAll(constructQuery(data, val));
}
