"use strict";

const app = new Axon("myApp");

app.controller("mainCtrl", [], function() {
    const vm = this;

    window.vm = this;

    vm.foo = "foo";
    vm.bar = "bar";

    vm.fooBar = vm.foo + vm.bar;

    vm.updateFooBar = function() {
        vm.fooBar = vm.foo + vm.bar;
    };
});

app.access("mainCtrl");
