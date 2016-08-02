"use strict";

let axon = new Axon("app"),
    app;

axon.module("myApp", [], function () {});

app = axon.access("myApp");
