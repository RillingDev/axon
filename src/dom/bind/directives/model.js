"use strict";

import query from "../../query/query";
import read from "../../query/read";
import bind from "../bind";

/**
 * Binds xn-model
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Node} context The Controller context
 */
export default function(ctrl, context) {
    const elements = query("model", "*", context);

    return bind(elements, "change", (ev, dom) => {
        const content = dom.value;
        const modelFor = read(dom, "model");

        console.log("MODEL:", modelFor, content);
        ctrl[modelFor] = content;
    });
}
