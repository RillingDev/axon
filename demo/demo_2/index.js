"use strict";

const app = new Axon({
    el: document.querySelector("#myApp"),
    data: {
        newItem: "Walk Dogs",
        list: ["Buy Milk", "Go for a Walk", "Learn Python", "Read a Book", "Pet Cat"]
    },
    methods: {
        addItem(item) {
            const vm = this;

            if (item !== "") {
                vm.list.push(item);
                vm.newItem = "";
            }
        },
        sort() {
            const vm = this;

            vm.list.sort();
        },
        reverse() {
            const vm = this;

            vm.list.reverse();
        },
        randomize() {
            const vm = this;

            vm.list.sort(() => Math.random() > 0.5);
        },
    }
});

console.log(app);
