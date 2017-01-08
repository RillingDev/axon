"use strict";

import directiveRefList from "./index";

const execDirectives = function (instance, domMap, execMode) {
    const recurseMap = function (mapNode, depth) {
        const nodeChildren = mapNode.children;
        const nodeDirectives = mapNode.directives;

        //Exec on node
        if (nodeDirectives.length) {
            mapNode.directives.forEach(directive => {
                const directiveRef = directiveRefList[directive.key];

                if (directiveRef) {
                    const directiveRefFn = directiveRef[execMode];

                    if (directiveRefFn) {
                        directiveRefFn(instance, mapNode.node, directive);
                    }
                }
            });
        }

        //Crawl children
        if (nodeChildren.length) {
            nodeChildren.forEach(child => {
                recurseMap(child, depth + 1);
            });
        }

    };

    recurseMap(domMap, 0);
};

export default execDirectives;
