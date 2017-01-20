"use strict";

import directiveRefList from "./index";

/**
 * Runs all directives from the domMap
 * @private
 * @param {Axon} instance Axon instance
 * @param {Object} domMap domMap to run directives
 * @param {String} execMode mode to run in ("init" or "render")
 */
const execDirectives = function (instance, domMap, execMode) {
    console.log([instance, domMap, execMode]);
    const instanceContent = {
        $data: instance.$data,
        $methods: instance.$methods
    };
    const instanceMethods = {
        $render: instance.$render.bind(instance),
        $init: instance.$init.bind(instance)
    };
    const recurseMap = function (mapNode) {
        const nodeChildren = mapNode.children;
        const nodeDirectives = mapNode.directives;
        let result = true;

        //Exec on node
        if (nodeDirectives.length) {
            //Only exec if directives on domNode
            mapNode.directives.forEach(directive => {
                const directiveRef = directiveRefList.find(item => item.name === directive.name);

                if (directiveRef) {
                    //Only exec if directive exists
                    const directiveRefFn = directiveRef[execMode];

                    if (directiveRefFn) {
                        //Only exec if directive has fn for current execMode
                        //@TODO restructure args
                        const directiveResult = directiveRefFn(mapNode.node, directive, instanceContent, instanceMethods, mapNode);

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
