"use strict";

import {
    getDataQueryDom
} from "./getDataQuery";

/**
 * Get value of directive on node
 * @param  {Node} node Node to check
 * @param  {String} name Directive to check
 * @return {String}      Directive value
 */
const getDirectiveValue = function(node, name) {
    const dataQuery = getDataQueryDom(name);

    return node.attributes[dataQuery].value;
};

export default getDirectiveValue;
