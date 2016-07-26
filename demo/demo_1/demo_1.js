"use strict";

let app = new Axon("app", []);

app.controller("mainCtr", [], function () {
    this.foo = "foo";
    this.bar = function () {
        return "bar";
    }
});
