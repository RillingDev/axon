"use strict";

const app = new Axon({
    el: "#myApp",
    data: {
        newItem: "Foo",
        list: ["Foo", "Bar", "Fizz"]
    },
    methods: {
        addItem(item) {
            const vm = this;

            vm.list.push(item);
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
