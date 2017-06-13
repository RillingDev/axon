"use strict";

const app = new Axon({
    el: "#myApp",
    data: {
        foo: "foooo",
        list: [1, 3, 15, 124, 2144]
    },
    methods: {
        getFoobar(foo) {
            console.log(this);
            return foo + this.foo + foo;
        }
    }
});

console.log(app);
