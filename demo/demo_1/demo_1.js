"use strict";

const app = new Axon({
    context: "#myApp",
    data: {
        foo: "foooo",
        bar: "baaar",
        foobar: "foooobaaar",
        dataChanged: false,
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
            vm.$data.dataChanged = true;

            vm.$render();
        }
    }
});

console.log(app);
