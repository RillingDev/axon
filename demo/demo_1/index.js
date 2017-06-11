"use strict";

const app = new Axon({
    el: "#myApp",
    data: {
        name: "Foo",
        foo: {
            bar: "Foooo"
        }
    },
    methods: {
        getFoo() {
            return "fooo";
        }
    }
});

console.log(app);