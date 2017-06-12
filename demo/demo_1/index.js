"use strict";

const app = new Axon({
    el: "#myApp",
    data: {
        name: "Foo",
        foo: {
            bar: "Fooooo"
        }
    },
    methods: {
        getFoo() {
            return "fooo";
        },
        eventy(a, b, c) {
            const vm = this;

            console.log("AAAAAAAAA", vm, a, b, c);
        }
    }
});

console.log(app);
