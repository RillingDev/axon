"use strict";

import getDirectives from "./getDirectives";

const getDomMap = function (entry) {
    const recurseNodes = function (node) {
        const directives = getDirectives(node);

        if (directives.length || node.childElementCount) {
            const result = {};
            const childArr = Array.from(node.children);

            result.node = node;
            result.children = [];
            result.directives = directives;

            //console.log(result);

            childArr.forEach((childNode) => {
                const childResult = recurseNodes(childNode);

                if (childResult.node) {
                    result.children.push(childResult);
                }

            });

            return result;
        } else {
            return false;
        }


    };


    return recurseNodes(entry, {});
};

export default getDomMap;
