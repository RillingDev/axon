"use strict";

import {
    _domNameSpace
} from "../../../lib/constants";

/**
 * Creates querySelector string
 *
 * @private
 * @param {String} name The data name
 * @param {String} val The data value
 * @return {String} Returns Query
 */
const constructQuery = function(name, val) {
    if (val) {
        return `[${_domNameSpace}-${name}='${val}']`;
    } else {
        return `[${_domNameSpace}-${name}]`;
    }
};

export default constructQuery;
