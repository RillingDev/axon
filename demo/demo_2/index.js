"use strict";

const app = new Axon({
    el: document.querySelector("#myApp"),
    data: {
        newItem: "Foo",
        list: ["Foo", "Bar", "Fizz"]
    },
    methods: {
        addItem() {
            const vm = this;

            vm.list.push(vm.newItem);
        },
        addItemReal() {
            const vm = this;

            vm.list = Array.from(vm.list).concat(vm.newItem);
        },
        swap() {
            const vm = this;

            vm.list = vm.list.reverse();
        },
        sort() {
            const vm = this;

            vm.list = vm.list.sort();
        }
    }
});
