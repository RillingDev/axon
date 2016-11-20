"use strict";

import getSelectorQuery from "../lib/getSelectorQuery";

/**
 * Queries all nodes in context with the given directive
 * @param  {Node}  context     Context to query
 * @param  {String}  name         Directive name
 * @param  {String|Boolean}  val          Directive value, or false if it should be ignored
 * @param  {Boolean} [multi=true] If more than one element should be queried
 * @return {Node|NodeList}               Query result
 */
const queryDirective = function(context, name, val, multi = true) {
    const query = getSelectorQuery(name, val);

    return multi ? context.querySelectorAll(query) : context.querySelector(query);
};

export default queryDirective;
