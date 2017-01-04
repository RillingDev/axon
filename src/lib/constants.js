"use strict";

const _document = document;

const TYPE_NAME_UNDEFINED = "undefined";
const TYPE_NAME_OBJECT = "object";
const TYPE_NAME_FUNCTION = "function";
const TYPE_NAME_STRING = "string";
const TYPE_NAME_NUMBER = "number";

const LIB_STRING_QUOTES = ["'", "\"", "`"];

const DOM_EVENT_TIMEOUT = 20; //event timeout in ms
const DOM_ATTR_PREFIX = "x-";
const DOM_ATTR_HIDDEN = "hidden";
const DOM_EVENT_MODEL = "input";

export {
    _document,

    TYPE_NAME_UNDEFINED,
    TYPE_NAME_OBJECT,
    TYPE_NAME_FUNCTION,
    TYPE_NAME_STRING,
    TYPE_NAME_NUMBER,

    LIB_STRING_QUOTES,

    DOM_EVENT_TIMEOUT,
    DOM_ATTR_PREFIX,
    DOM_ATTR_HIDDEN,
    DOM_EVENT_MODEL
};
