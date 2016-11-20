"use strict";

import {
    getDataQueryDom
} from "./getDataQuery";

/**
 * Creates querySelector string
 *
 * @private
 * @param {String} name The data name
 * @param {String} val The data value
 * @return {String} Returns Query
 */
const getSelectorQuery = function(name, val) {
    const dataQuery = getDataQueryDom(name);

    if (val) {
        return `[${dataQuery}='${val}']`;
    } else {
        return `[${dataQuery}]`;
    }
};

export default getSelectorQuery;
