"use strict";

const getDomMap = function (entry, fn) {
    const result = {};
    const recurseNodes = function (node, container) {
        container.node = node;
        container.children = [];
        fn(container, node);

        if (node.childElementCount) {
            const childArr = Array.from(node.children);

            childArr.forEach((childNode, index) => {
                container.children[index] = {};

                recurseNodes(childNode, container.children[index]);
            });
        }
    };

    recurseNodes(entry, result);

    return result;
};

export default getDomMap;
