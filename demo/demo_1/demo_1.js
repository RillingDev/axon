"use strict";

let app = new Axon("app");

app.factory("mainCtr", [], function () {
    this.foo = "foo";
    this.bar = function () {
        return "bar";
    };
});
