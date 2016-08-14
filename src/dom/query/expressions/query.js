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
    const nodes = getTextNodes(context);
    let match;

    //Iterate Nodes
    nodes.forEach(node => {
      //Iterate Regex
        while ((match = _expressionRegex.exec(node.textContent)) !== null) {
            if (match.index === _expressionRegex.lastIndex) {
                _expressionRegex.lastIndex++;
            }

            result.push({
                match: match[0],
                data: match[1],
                val: match[1],
                index: match.index,
                parent : node
            });
        }
    });

    return result;

    //Modified version of http://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
    function getTextNodes(node) {
        let all = [];
        for (node = node.firstChild; node; node = node.nextSibling) {
            if (node.nodeType === 3 && node.parentNode.nodeName !== "SCRIPT") {
                all.push(node);
            } else {
                all = all.concat(getTextNodes(node));
            }
        }
        return all;
    }
}
