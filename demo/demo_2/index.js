"use strict";

const app = new Axon({
    el: document.querySelector("#myApp"),
    data: {
        newItem: {
            name: "Walk Dogs",
            priority: 2
        },
        list: [{
                name: "Buy Milk",
                priority: 1
            },
            {
                name: "Go for a Walk",
                priority: 6
            },
            {
                name: "Learn Python",
                priority: 8
            },
            {
                name: "Read a Book",
                priority: 2
            },
            {
                name: "Pet Cat",
                priority: 10
            }
        ]
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
            this.list = Array.from(this.list).sort((a, b) => a.priority < b.priority);
        },
        reverseOrder() {
            this.list = Array.from(this.list).reverse();
        },
        randomizeOrder() {
            this.list = Array.from(this.list).sort(() => Math.random() > 0.5);
        },
        getTodoLength() {
            return this.list.length;
        },
        listHasItems() {
            return this.list.length > 0;
        },
        getGrayscaleColorFromPriority(priority) {
            const offset = 2;
            const val = (16 - offset) + Math.floor(((16 - offset) / 10) * -priority);
            const color = "#" + (val < 0 ? 0 : val).toString(16).padEnd(2, "0").repeat(3);

            return `color:${color};`;
        }
    }
});

console.log(app);
