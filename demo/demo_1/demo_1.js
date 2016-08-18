"use strict";

let app = new Axon("myApp");

app.controller("myController", [], function() {
    const vm = this;
    window.vm = this;

    vm.foo = "foo";
    vm.bar = "bar";

    vm.fooBar = vm.foo + vm.bar;

    vm.updateFooBar = function() {
        vm.fooBar = vm.foo + vm.bar;
    };
});

app.access("myController");
