"use strict";

const mapNodes = function (entry, fn) {
    const result = {};
    const recurseNodes = function (node, depth, container) {
        container.node = node;
        container.children = [];
        fn(container, node, depth);

        if (node.childElementCount) {
            const childArr = Array.from(node.children);

            childArr.forEach((childNode, index) => {
                container.children[index] = {};

                recurseNodes(childNode, depth + 1, container.children[index]);
            });
        }
    };

    recurseNodes(entry, 0, result);

    return result;
};

export default mapNodes;
