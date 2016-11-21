"use strict";

const app = new Axon("myApp");
let mainCtrl;

app.controller("mainCtrl", [], function() {
    const vm = this;

    vm.foo = "foo";
    vm.bar = "bar";
    vm.foobar = "notgood"

    vm.getFoobar = function() {
        vm.foobar = vm.foo + vm.bar;

        console.log("EVENT",  `${vm.foo} + ${vm.bar} => ${vm.foobar}`);
        //vm.$render();
    };
});

mainCtrl = app.access("mainCtrl");
//mainCtrl.$render();

console.log(app, mainCtrl);
