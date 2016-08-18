"use strict";

import {
    eachObject
} from "../../util";

import directives from "../../plugins/directives";
import expressions from "../../plugins/expressions";

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

    iteratePlugins(directives, ctrl.$directives, (entry, plugin) => {
        plugin.onDigest(ctrl, ctrl.$context, entry);
    });

    iteratePlugins(expressions, ctrl.$expressions, (entry, plugin) => {
        evaluate(ctrl, entry);
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
