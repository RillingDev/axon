"use strict";

//Axon({el,data,methods})
const app = new Axon({
    el: document.querySelector("#myApp"), //Query for the root element
    data: {
        name: "Lorem ipsum",
        bar: "bar"
    },
    methods: {
        setBar(val) {
            this.bar = val;
            this.render();
        }
    }
});

console.log(app);
