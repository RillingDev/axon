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
        eventy() {
            console.log("AAAAAAAAA");
        }
    }
});

console.log(app);