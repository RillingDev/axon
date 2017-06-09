"use strict";

const app = new Axon({
    el: "#myApp",
    data: {
        name: "Foo",
        foo: {
            bar: 123123
        }
    },
    methods: {
        getFoo() {
            return "fooo";
        }
    }
});

console.log(app);
