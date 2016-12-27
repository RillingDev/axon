"use strict";

const app = new Axon({
    context: "#myApp",
    data: {
        foo: "foooo",
        bar: "baaar",
        foobar: "foooobaaar"
    },
    methods: {
        changeValue: function (type, target, event) {
            const _this = this;

            _this.$data[type] = target.value;
            _this.$data.foobar = _this.$data.foo + _this.$data.bar;

            console.log(_this.$data);
            _this.$render();
        }
    }
});

console.log(app);
