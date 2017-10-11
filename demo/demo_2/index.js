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

            vm.render();
        },
        swap() {
            const vm = this;

            vm.list = vm.list.reverse();
            vm.render();
        },
        sort() {
            const vm = this;

            vm.list = vm.list.sort();
            vm.render();
        }
    }
});
