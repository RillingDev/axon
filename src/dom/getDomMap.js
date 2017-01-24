"use strict";

import getDirectives from "./getDirectives";
import isDefined from "../lib/isDefined";

const getDomMap = function (entry) {
    const recurseNodes = function (node) {
        console.log([node]);
        const nodeDirectives = getDirectives(node);
        const nodeChildren = node.children;

        if (nodeDirectives.length || nodeChildren.length) {
            let result = {
                node,
                directives: nodeDirectives,
                children: []
            };
            const childArr = Array.from(nodeChildren);

            childArr.forEach(childNode => {
                const childResult = recurseNodes(childNode);

                if (isDefined(childResult)) {
                    result.children.push(childResult);
                }
            });

            return result;
        }

    };

    return recurseNodes(entry);
};

export default getDomMap;
