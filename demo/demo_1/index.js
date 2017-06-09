"use strict";

const app = new Axon({
    el: "#myApp",
    data: {
        name: "Foo",
        foo:{
            bar:123123
        }
    },
    methods: {}
});

console.log(app);
