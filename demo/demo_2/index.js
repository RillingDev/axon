"use strict";

const app = new Axon({
    el: "#myApp",
    data: {
        newItem: "Foo",
        list: [1, 23, 415, 25, 2521]
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
        }
    }
});
