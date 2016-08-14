"use strict";

let app = new Axon("myApp");

app.controller("myController", [], function() {
    this.foo = "foooo";
    this.bar = "barrr";
});
