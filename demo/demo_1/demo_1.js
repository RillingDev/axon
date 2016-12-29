"use strict";

const app = new Axon({
    context: "#myApp",
    data: {
        foo: "foooo",
        bar: "baaar",
        foobar: "nope",
        classes:{
            foo:""
        }
    },
    methods: {
        changeValue: function (type, value) {
            const _this = this;

            _this.$data[type] = value;
            _this.$data.foobar = _this.$data.foo + _this.$data.bar;
            _this.$data.classes.foo="class_"+_this.$data.foobar;

            //console.log(_this.$data);
            _this.$render();
        }
    }
});

console.log(app);
