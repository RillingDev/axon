"use strict";

const app = new Axon({
    context: "#myApp",
    data: {
        foo: "foooo",
        bar: "baaar",
        foobar: "foooobaaar",
        dataLength: 0
    },
    methods: {
        changeValue(type, value) {
            const vm = app;
            
            vm.$data[type] = value;
            vm.$methods.updateFoobar();
        },
        updateFoobar() {
            const vm = app;

            vm.$data.foobar = vm.$data.foo + vm.$data.bar;
            vm.$data.dataLength = vm.$data.foobar.length;

            vm.$render();
        }
    }
});

app.$methods.updateFoobar();

console.log(app);
