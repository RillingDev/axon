"use strict";

import queryExpressions from "../../query/expressions/query";

/**
 * Binds expressions
 *
 * @private
 * @return {Node} context The Controller context
 */
export default function(context) {
  console.log(context);
    const elements = queryExpressions(context);

    console.log(elements);

    return elements;
}
