"use strict";


import constructQuery from "./lib/constructQuery";

/**
 * Query Nodes with directives from DOM
 *
 * @private
 * @param {Node} context Node context to query
 * @param {String} name The data name
 * @param {String} val The data value
 * @param {Boolean} multi optional, if multiple should be queried
 * @return {NodeList} Returns NodeList
 */
const queryDirective = function(context, name, val, multi = true) {
    const query = constructQuery(name, val);

    return multi ? context.querySelectorAll(query) : context.querySelector(query);
};

export default queryDirective;
