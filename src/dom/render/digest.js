"use strict";

import {
    eachObject
} from "../../util";

import * as directives from "../../plugins/directives/directives";

import evaluate from "./evaluate";

/**
 * Digest & render dom
 *
 * @private
 * @param {Object} ctrl The Controller
 * @return {Node} context The Controller context
 */
export default function(ctrl) {
    //@TODO implement debounce

    //console.log("digest");
    iteratePlugins(directives, ctrl.$directives, (entry, plugin) => {
        plugin.onDigest(ctrl, ctrl.$context, entry);
    });

    //Calc expressions
    ctrl.$expressions.forEach(expression => {
        evaluate(ctrl, expression);
    });

    function iteratePlugins(pluginData, data, fn) {
        eachObject(pluginData, (plugin, key) => {
            const active = data[key];

            active.forEach(entry => {
                fn(entry, plugin);
            });
        });
    }
}
