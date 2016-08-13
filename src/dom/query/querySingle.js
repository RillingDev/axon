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
 * @param {Node} context optional, query context
 * @return {Node} Returns Node
 */
export default function(data, val, context) {
    return (context ? context : _document).querySelector(constructQuery(data, val));
}
