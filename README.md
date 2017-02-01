![AxonJS](./logo.png)

# AxonJS

> A super tiny vue-like framework

## Introduction

Axon is an very small(3KB) JavaScript framework inspired by Vue.js.
Instead of using the "v" namespace for directives, axon uses "x".

## Usage

Axon can be installed from the npm registry:

```shell
npm install axonjs --save
```

```shell
yarn add axonjs
```

## Syntax

### Constructor

To start with Axon, you need to create a new Axon container:

```javascript
//Axon({el,data,methods})
const app = new Axon({
    el: "#myApp",
    data: {
        name: "",
    },
    methods: {}
});
```

This constructor is the same as when using Vue.

- `el` contains the selector for the root-node of your app
- `data` contains all data that the app uses
- `methods` contains all methods that the app accesses via directives

### Directives

Axon currently has the following directives:

- `x-ignore`: ignore this and all childnodes while rendering
- `x-if="#expression#"`: if the value evaluates to true, this node and childnodes will render, else they will be ignored and hidden
- `x-model="#property#"`: binds the property to the node and attaches an event to update 
- `x-bind:#attr#="#expression#"`: binds the value of the expression as the given attribute
- `x-on:#event#="method()"`: attaches the given method as eventhandler for the given event
