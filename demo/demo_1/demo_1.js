"use strict";

const app = new Axon({
    context: "#myApp",
    data: {
        foo: "foooo",
        bar: "baaar",
        foobar: "foooobaaar"
    },
    methods: {
        changeValue: function (type, value) {
            const _this = this;

            _this.$data[type] = value;
            _this.$data.foobar = _this.$data.foo + _this.$data.bar;

            console.log(_this.$data);
            _this.$render();
        }
    }
});

console.log(app);
