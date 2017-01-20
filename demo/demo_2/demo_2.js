"use strict";

const app = new Axon({
    context: "#myApp",
    data: {
        model_1: "foooo",
        randomNumbers: [1, 3, 15, 124, 2144],
        i: "bar"
    },
    methods: {
        getFoobar(foo) {
            return foo + "bar";
        }
    }
});

console.log(app);
