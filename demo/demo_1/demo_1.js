"use strict";

const app = new Axon({
    context: "#myApp",
    data: {
        foo: "foooo",
        bar: "baaar",
        foobar: "foooobaaar",
        classes: {
            foo: "class_foooobaaar"
        }
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
            vm.$data.classes.foo = "class_" + vm.$data.foobar;

            vm.$render();
        }
    }
});

app.$methods.updateFoobar();

console.log(app);
