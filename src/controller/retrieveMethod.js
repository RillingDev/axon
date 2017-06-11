"use strict";

const REGEX_METHOD = /([\w\.]+)\s*\(((?:[^()]+)*)?\s*\)\s*/;

import findPropInNode from "./findPropInNode";
import { isDefined } from "../util";

//@TODO
const retrieveMethod = function(expression, node) {
    const matched = expression.match(REGEX_METHOD);
    const path = matched[1].split(".");
    const args = isDefined(matched[2]) ? matched[2].split(",") : [];

    const data = findPropInNode(path, node._root.methods);

    if (data !== false) {
        data.args = args;

        return data;
    } else {
        return false;
    }
};

export default retrieveMethod;
