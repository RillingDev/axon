"use strict";

import query from "../../query/directives/query";
import read from "../../query/directives/read";

import digest from "../../render/digest";

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

    bind(elements, "change", modelEvent);
    bind(elements, "keydown", modelEvent);

    return elements;

    function modelEvent(ev, dom) {
        const content = dom.value;
        const modelFor = read(dom, "model");

        console.log("MODEL:", modelFor, content);
        ctrl[modelFor] = content;

        digest();
    }
}
