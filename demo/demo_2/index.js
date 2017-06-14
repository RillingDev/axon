"use strict";

const app = new Axon({
    el: "#myApp",
    data: {
        newItem: "Foo",
        list: [1, 3, 15, 124, 2144]
    },
    methods: {
        addItem() {
            const vm = this;

            vm.list.push(vm.newItem);
            vm.render();
        }
    }
});

console.log(app);
