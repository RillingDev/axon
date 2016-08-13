"use strict";

let app = new Axon("myApp");

app.controller("myController", [], function() {
    this.bar = 1;
});
