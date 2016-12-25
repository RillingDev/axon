"use strict";

import {
    eachNode
} from "../lib/util";

const crawlNodes = function (entry, fn) {
    const recurseNodes = function (node, fn) {
        const children = node.children;

        if (children && children.length > 0) {
            let result = true;

            result = eachNode(children, childNode => {
                return recurseNodes(childNode, fn);
            });

            return result;
        } else {
            return fn(node);
        }
    };

    return recurseNodes(entry, fn)
};

export default crawlNodes;
