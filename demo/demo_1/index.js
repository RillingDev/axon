"use strict";

//Axon({el,data,methods})
const app = new Axon({
    el: "#myApp", //Query for the root element
    data: {
        name: "abc",
        bar: "bar"
    },
    methods: {
        setBar(val){
            this.bar = val;
            this.render();
        }
    }
});

console.log(app);
