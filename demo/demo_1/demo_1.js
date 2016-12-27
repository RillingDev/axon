"use strict";

const app = new Axon({
    context: "#myApp",
    data: {
        foo: "foooo",
        bar: "baaar",
        foobar: "wrong!"
    },
    methods: {
        getFoobar: function (a, b) {
            const _this = this;

            console.log("getFoobar()!", [a, b]);

            _this.$data.foobar = _this.$data.foo + _this.$data.bar;
            _this.$render();
        }
    }
});

console.log(app);
