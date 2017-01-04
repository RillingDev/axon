"use strict";

const app = new Axon({
    context: "#myApp",
    data: {
        foo: "foo",
        bar: "bar",
        foobar: "nope",
        dataLength: 0
    },
    methods: {
        updateFoobar() {
            const vm = app;

            vm.$data.foobar = vm.$data.foo + vm.$data.bar;
            vm.$data.dataLength = vm.$data.foobar.length;

            console.log([vm.$data.foo, vm.$data.bar, "=>", vm.$data.foobar]);
        }
    }
});

app.$methods.updateFoobar();

console.log(app);
