"use strict";

const retrieveMethod = function (app, methodName) {
    return app.$methods.getFoobar;
};

export default retrieveMethod;
