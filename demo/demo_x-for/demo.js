"use strict";

const app = new Axon({
    context: "#myApp",
    data: {
        "tickets": [{
                "ticket": "1",
                "product": "laptop",
                "problem": "its overheating"
            },
            {
                "ticket": "2",
                "product": "laptop",
                "problem": "its over heating"
            },
            {
                "ticket": "3",
                "product": "note 7",
                "problem": "its on fire"
            }
        ]
    },
    methods: {
        //
    }
});

console.log(app);
