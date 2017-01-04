"use strict";

const _document = document;

const TYPE_NAME_UNDEFINED = "undefined";
const TYPE_NAME_OBJECT = "object";
const TYPE_NAME_FUNCTION = "function";
const TYPE_NAME_STRING = "string";
const TYPE_NAME_NUMBER = "number";

const LIB_STRING_QUOTES = ["'", "\"", "`"];
const LIB_DEBOUNCE_TIMEOUT = 32; //event timeout in ms

const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_HIDDEN = "hidden";

export {
    _document,

    TYPE_NAME_UNDEFINED,
    TYPE_NAME_OBJECT,
    TYPE_NAME_FUNCTION,
    TYPE_NAME_STRING,
    TYPE_NAME_NUMBER,

    LIB_STRING_QUOTES,
    LIB_DEBOUNCE_TIMEOUT,

    DOM_ATTR_PREFIX,
    DOM_ATTR_HIDDEN
};
