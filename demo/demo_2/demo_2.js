"use strict";

const app = new Axon({
    context: "#myApp",
    data: {
        model_1: "foooo"
    },
    methods: {
        getFoobar(foo) {
            return foo + "bar";
        }
    }
});

console.log(app);
