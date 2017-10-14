"use strict";

const app = new Axon({
    el: document.querySelector("#myApp"),
    data: {
        newItem: {
            name: "Walk Dogs",
            priority: 2,
        },
        list: [{
            name: "Buy Milk",
            priority: 1
        }, {
            name: "Go for a Walk",
            priority: 3
        }, {
            name: "Learn Python",
            priority: 2
        }, {
            name: "Read a Book",
            priority: 1
        }, {
            name: "Pet Cat",
            priority: 7
        }]
    },
    methods: {
        addItem(item) {
            if (item.name !== "") {
                this.list.push({
                    name: item.name,
                    priority: item.priority
                });
                this.newItem.name = "";
                this.newItem.priority = 1;
            }
        },
        removeItem(itemTarget) {
            this.list = this.list.filter(item => item.name !== itemTarget.name);
        },
        sortOrder() {
            this.list.sort((a, b) => a.priority < b.priority);
        },
        reverseOrder() {
            this.list.reverse();
        },
        randomizeOrder() {
            this.list.sort(() => Math.random() > 0.5);
        },
        getTodoLength() {
            return this.list.length;
        }
    }
});

console.log(app);
