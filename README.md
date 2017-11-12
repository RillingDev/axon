# AxonJS

> A super tiny VueJS-like framework

![AxonJS](./logo.png)

## Introduction

Axon is an very small(4KB) JavaScript framework inspired by Vue.js.
Instead of using the `v-` namespace for directives, axon uses `x-`.

This framework is **not** supposed or able to be "the next big framework", this is just a hobby project of mine.
You _will_ encounter bugs and should never use this in production.
Functionality and compatibility is much more limited than in Vue, due to the difference in complexity of the codebase.
Most of the API is either the same or very similar as in Vue, however make sure to read the docs.

### Core Differences to Vue

Advantages:

+ Smaller file
+ Faster parsing and render

Disadvantages:

+ No mustache (`{{}}`) expressions
+ Less built-in directives
+ No component support
+ Limited directive expressions (`x-if="foo.bar>=getBar()"` for example doesn't work, only `x-if="isBiggerEqual(foo.bar)` would)
+ Much more

## Usage

Axon can be installed from the npm registry:

```shell
npm install axonjs -S
```

## Syntax

### Constructor

To start with Axon, you need to create a new Axon App:

```javascript
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
        }
    }
});
```

```html
<div id="myApp">
    <div>
        <label>Name:</label>
        <input type="text" x-model="name">
    </div>
    <div>
        <label>Bar:</label>
        <input type="text" x-model="bar">
        <button class="btn btn-primary" x-on:click="setBar('bar')">Reset Bar</button>
    </div>
    <div x-if="name.length">
        <p>Hello <span x-text="name"></span>! The value of `bar` is <span x-text="bar"></span></p>
    </div>
</div>
```

### Directives

Axon currently has the following directives:

+ `x-if="#expression#"`: if the value evaluates to true, this node and child-nodes will render, else they will be ignored and hidden
+ `x-on:#event#="method()"`: attaches the given method as event-handler for the given event
+ `x-model="#property#"`: binds the property to the node and attaches an event to update
+ `x-bind:#attr#="#expression#"`: binds the value of the expression as the given attribute
+ `x-text="#expression#"`: inserts expression content as text
+ `x-html="#expression#"`: inserts expression content as HTML
+ `x-for="#variable# of #property#"`: loops over values in Array and creates elements with bound data for each

## Changes from v1.x to v2.x

+ `x-for="i in array"` is now `x-for="i of array"`
+ `el` is no longer queried automatically (`el: "#app"` ->  `el: document.querySelector("#myApp"`))
