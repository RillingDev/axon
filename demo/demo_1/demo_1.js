"use strict";

const app = new Axon({
    context: "#myApp",
    data: {
        foo: "foooo",
        bar: "baaar"
    },
    methods: {
        getFooBar: function () {
            return this.data.foo + this.data.bar;
        }
    }
});

console.log(app);