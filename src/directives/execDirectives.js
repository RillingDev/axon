"use strict";

import directiveRefList from "./index";

const execDirectives = function (instance, domMap, execMode) {
    const recurseMap = function (mapNode) {
        const nodeChildren = mapNode.children;
        const nodeDirectives = mapNode.directives;
        let result = true;

        //Exec on node
        if (nodeDirectives.length) {
             //Only exec if directives on domNode
            mapNode.directives.forEach(directive => {
                const directiveRef = directiveRefList[directive.key];

                if (directiveRef) {
                     //Only exec if directive exists
                    const directiveRefFn = directiveRef[execMode];

                    if (directiveRefFn) {
                        //Only exec if directive has fn for current execMode
                        const directiveResult = directiveRefFn(instance, mapNode.node, directive);

                        if (!directiveResult) {
                            //Stop crawling on directive return 'false'
                            result = false; 
                        }
                    }
                }
            });
        }

        //Crawl children
        if (result && nodeChildren.length) {
            nodeChildren.forEach(child => {
                recurseMap(child);
            });
        }

    };

    recurseMap(domMap);
};

export default execDirectives;
