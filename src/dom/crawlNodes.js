"use strict";

const crawlNodes = function (entry, fn) {
    const recurseNodes = function (node, fn) {
        let result = fn(node);

        if (node.childElementCount) {
            const childArr = Array.from(node.children);

            childArr.forEach(childNode => {
                result = recurseNodes(childNode, fn);
            });
        }

        return result;
    };

    return recurseNodes(entry, fn);
};

export default crawlNodes;
