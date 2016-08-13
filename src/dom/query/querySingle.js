"use strict";

import {
    _document
} from "../../constants";
import constructQuery from "./constructQuery";

/**
 * Query single from DOM
 *
 * @private
 * @param {String} data The data id
 * @param {String} val The data value
 * @return {Node} Returns Node
 */
export default function(data, val) {
    return _document.querySelector(constructQuery(data, val));
}
