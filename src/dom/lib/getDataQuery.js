"use strict";

import {
    _domNameSpace
} from "../../lib/constants";

/**
 * Get directive dom name
 * @param  {String} name Directive name
 * @return {String}      Dom name
 */
export const getDataQueryDom = function(name) {
    return `${_domNameSpace}-${name}`;
};

/**
 * Get directive dataset name
 * @param  {String} name Directive name
 * @return {String}      Dataset name
 */
export const getDataQueryDataset = function(name) {
    const camelCase = name.substr(0, 1).toUpperCase() + name.substr(1);

    return `${_domNameSpace}${camelCase}`;
};
