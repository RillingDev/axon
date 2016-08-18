"use strict";

export default function(ctrl, context, entry) {
    console.log("foo", entry);
    entry.element.value = ctrl[entry.value];
}
