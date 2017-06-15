"use strict";

const app = new Axon({
    el: "#myApp",
    data: {
        newItem: "Foo",
        list: [{a:1}, {a:32}, {a:124}, {a:12}, {a:1212}]
    },
    methods: {
        addItem(item) {
            const vm = this;

            vm.list.push({a:item});
            vm.render();
        },
        swap() {
            const vm = this;

            vm.list = vm.list.reverse();
            vm.render();
        }
    }
});

console.log(app);
