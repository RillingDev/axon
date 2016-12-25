"use strict";

const bindEventString = function (node, eventType, eventFnString, instance) {
    //@TODO make this safer
    //Split up function string
    const eventFnStringSplit = eventFnString.substr(0, eventFnString.length - 1).split("(");
    const eventFnName = eventFnStringSplit[0];
    const eventFnArgs = eventFnStringSplit[1].split(",").map(Number);
    const eventFnTarget = instance.$methods[eventFnName];

    if (typeof eventFnTarget === "function") {
        const eventFn = function (e) {
            const args = Array.from(eventFnArgs);

            eventFnArgs.push(e);
            eventFnTarget.call(instance, args);
        };

        node.addEventListener(eventType, eventFn, false);
    } else {
        throw new Error(`Event fn '${eventFnName}' not found`);
    }
};

export default bindEventString;
