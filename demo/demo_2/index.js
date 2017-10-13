"use strict";

const app = new Axon({
    el: document.querySelector("#myApp"),
    data: {
        newItem: "Walk Dogs",
        list: ["Buy Milk", "Go for a Walk", "Learn Python", "Read a Book", "Pet Cat"]
    },
    methods: {
        addItem() {
            const vm = this;

            if (vm.newItem !== "") {
                vm.list.push(vm.newItem);
                vm.newItem = "";
            }
        },
        sort() {
            const vm = this;

            console.log(vm);

            vm.list.sort();
        },
        reverse() {
            const vm = this;

            console.log(vm);

            vm.list.reverse();
        },
        randomize() {
            const vm = this;

            console.log(vm);

            vm.list.sort(() => Math.random() > 0.5);
        },
    }
});
