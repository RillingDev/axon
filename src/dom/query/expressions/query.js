"use strict";

import {
    _expressionRegex
} from "../../../constants";

/**
 * Query Expressions
 *
 * @private
 * @param {Node} context The Element context
 * @return {NodeList} Returns NodeList
 */
export default function(context) {
    const result = [];
    const str = context.outerHTML;
    let match;


    while ((match = _expressionRegex.exec(str)) !== null) {
        if (match.index === _expressionRegex.lastIndex) {
            _expressionRegex.lastIndex++;
        }

        result.push({
            match: match[0],
            data: match[1],
            index: match.index
        });
    }

    return result;
}
