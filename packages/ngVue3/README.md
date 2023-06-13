<p align="center">
  <img src="https://github.com/jaredmcateer/ngVue3/blob/main/packages/ngVue3/static/ngVueLogo.png?raw=true" width="200" />
</p>
<h1 align="center" style="margin-top: 0px;">ngVue 3</h1>

ngVue 3 is a fork of the [ngVue](https://github.com/ngVue/ngVue) project which is still recommended for Vue 2

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Install](#install)
- [Features](#features)
  - [The `createVueComponent` factory](#the-createvuecomponent-factory)
    - [The `ngVueComponent` helper](#the-ngvuecomponent-helper)
  - [Directive attributes](#directive-attributes)
    - [`v-props` / `v-props-*`](#v-props--v-props-)
    - [`watch-depth`](#watch-depth)
      - [Notes](#notes)
    - [`v-on-*`](#v-on-)
  - [Handling HTML Attributes](#handling-html-attributes)
- [Plugins, Injectables, Directives and Global Components](#plugins-injectables-directives-and-global-components)
  - [Directives usage](#directives-usage)
- [TODO](#todo)

## Install

via npm:

`npm install @jaredmcateer/ngvue3`

via yarn:

`yarn add @jaredmcateer/ngvue3`

via pnpm:

`pnpm install @jaredmcater/ngvue3`

Usage:

**ngVue3** comes in both UMD and ESM packages and is compatible with CommonJS, AMD and ES Module as well as supporting browser global variable definition.

First of all, load AngularJS 1.x, Vue 3 and ngVue 3:

```html
<!-- load on the page with `script` tag -->
<script src="./node_modules/angular/angular.min.js"></script>
<script src="./node_modules/vue/dist/vue.global.js"></script>
<script src="./node_modules/ngVue/dist/main.js"></script>
<!-- or if using modules -->
<script type="module" src="./node_modules/ngVue/dist/main.mjs"></script>
```

or:

_CommonJs Style_

```javascript
const ng = require("angular");
const vue = require("vue");
const { useNgVue } = require("@jaredmcateer/ngvue3");
```

_UMD Style_

```javascript
// the AMD style
require(["angular", "vue", "ngVue3"], function (ng, Vue, ngVue3) {
  const useNgVue = ngVue3.useNgVue();
});
```

_ECMAScript module style_

```javascript
import angular from "angular";
import vue from "vue";
import { useNgVue } from "@jaredmcateer/ngvue3";
```

And then require `ngVue` as a dependency in your app:

```javascript
const ngVue = useNgVue();

angular.module("yourApp", [ngVue]);
```

## Features

**ngVue 3** is composed of a factory `createVueComponent`. Unlike the previous version there is no plain `vue-component` directive nor plans to implement it, however, if you rely on this we are happy to accept a PR.

### The `createVueComponent` factory

The `createVueComponent` factory creates a reusable Angular directive which is bound to a specific Vue component. This allows for writing components in your angular templates with a similar API to your native vue components.

The factory returns a plain `$compile` options object which describe how to compile the Angular directive with Vue 3, and it takes the Vue component as the first argument. The directive wraps the Vue component into an angular directive so that the component can be created and initialized while angular is compiling the templates.

An **Angular controller** needs to be created to declare view data

```javascript
const ngVue = useNgVue();
const app = angular.module("vue.components", [ngVue]).controller(
  "MainController",
  class MainController {
    constructor() {
      this.person = {
        firstName: "Barb",
        lastName: "Ara",
      };
    }
  }
);
```

Then declare a **Vue component**:

```javascript
import { h } from "vue";
export default defineComponent({
  props: {
    firstName: String,
    lastName: String,
  },
  setup(props) {
    return () => h("span", `Hello, ${props.firstName} ${props.lastName}`);
  },
});
```

**Note**: It doesn't have to be exactly like this you can use any flavour of component declaration you want, Options API, Composition API, and Script Setup, SFC or rendering with (j|t)sx all should work.

And finally **regsiter the Vue component** in the Angular module with the `createVueComponent` factory like this:

```javascript
import SomeComponent from "./SomeComponent.vue";
app.directive("SomeComponent", (createVueComponent) => createVueComponent(SomeComponent));
```

#### The `ngVueComponent` helper

The previous example contains a lot of boilerplate for creating a vue component, especially when you couple it with minification support you end up with

```javascript
import SomeComponent from "./SomeComponent.vue";
app.directive("SomeComponent", [
  "createVueComponent",
  (createVueComponent) => createVueComponent(SomeComponent),
]);
```

**ngVue 3** provides a helper function, `ngVueComponent`, to DRY this code

```javascript
import { ngVueComponent } from "@jaredmcateer/ngvue3";
// ...
app.directive(...ngVueComponent("SomeComponent", SomeComponent));
```

### Directive attributes

The directive created by `createVueComponent` provides two main attributes:

#### `v-props` / `v-props-*`

`v-props` is a string expression evaluated to an object as the data exposed to the Vue component

`v-props-*` allows you to name the partial data extract from angular scope. The directive then wraps them into a new object and passes it to the Vue component. E.g., `v-props-first-name` and `v-props-last-name` will create two properties `firstName` and `lastName` in a new object as the component data.

#### `watch-depth`

This attribute indicates which watch strategy AngularJs will use to detect changes on the scope object. The possible values are as follows:

| value      | description                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| reference  | _(default)_ watches the object reference                                                                                                                                             |
| collection | _(rarely used)_ same as angular `$watchCollection`, shallow watches the properties of the object: for arrays, it watches the array items; for object maps, it watches the properties |
| value      | _(rarely used)_ deep watches every property inside the object                                                                                                                        |

##### Notes

- `watch-depth` cannot propagate all the changes on the scope object to Vue due to the limitation of the reactivity system. (TODO this may be somewhat outdated as it comes from Vue 2, the new reactivity system is somewhat improved, need to check the veracity of this statement)
- The `colleciton` strategy and `value` strategy are rarely used. The scope object will be converted into a reactive object by Vue and so any changes on the reactive scope object will trigger the Vue updates.
- The `value` strategy is **not recommended** because it causes heavy computation. To detect the change, Angular must copy the entire object and traverse every property inside for each digest cycle.

#### `v-on-*`

`v-on-*` takes a string representation of a function handler. The directive wraps them into a new object and passes it to the Vue component similar to `v-props-*`. E.g., `v-on-button-clicked` will create a property `onButtonClicked` in a new object as the component events.

```javascript
app.controller("MainController", function () {
  this.handleHelloEvent = (greetings) => console.log(greetings);
});
```

```html
<some-component v-on-hello-world="ctrl.handleHelloEvent"></some-component>
```

```javascript
import { h } from "vue";
export default defineComponent({
  events: ["hello-world"],
  methods: {
    helloFromVue() {
      this.$emit("hello-world", "Hello World!");
    },
  },
  render() {
    return h("button", { onClick: () => this.helloFromVue() });
  },
});
```

**WARNING**: If the event handler uses `this` you must provide a bound function to the value of a `v-on-*` attribute. It is a common case that in class based controllers you will have a method on the class instance that handles events

_e.g.,_

```javascript
class MainController {
  handleClick() {
    this.buttonClicked = true;
  }
}
```

The methods on the prototype of the class instance **are not** bound so when you provide them to the attribute `v-on-button-clicked="ctrl.handleClick"` the scope will be lost (Cannot set property 'buttonClicked' of undefined).

A simple solution to this is to bind the event in the attribute value `v-on-button-clicked="ctrl.handleClick.bind(ctrl)"`, alternatively you can create an instance property on the class with an arrow function.

### Handling HTML Attributes

Just like regular Vue components, you can pass HTML attributes from the parent Angular component to your Vue component. The parent's `class` and `style` attributes will be merged with the corresponding Vue component attributes, while other will be passed down unless they conflict with attributes in the Vue component's own template.

Keep in mind that hwne you pass down literal strings for anything other than `class` and `style` attributes, they must be surrounded by quotes. e.g., `data-values="'enabled'"`, as they will be evaluated by angular before being passed on.

```html
<my-custom-button
  disabled="ctrl.isDisabled"
  class="excellent"
  tabindex="3"
  type="'submit'"
  v-props-button-text="'Click me'"
/>
```

**Note**: If your component uses a multi-root template you must bind the `$attrs` to an element

```html
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

## Plugins, Injectables, Directives and Global Components

Due to the architectural changes introduced by Vue 3 in most cases if you need access to lifecycle hooks you can simply create a composable and use it directly in your vue components. However, there are instances you need to install plugins (e.g., Pinia/Vuex, VueRouter, etc), directives or you want access to shared logic in your angular app. Plugins in ngVue 3 have been revamped to be simpler, access to "root" props is no longer possible, however you can now pass through Plugins, Injectables and Directive easily as well as still create your own custom ngVue Plugin.

[Plugin, Injectables, Directives and Global Components Documentation](./docs/plugins.md)

### Directives usage

Using a directive on your ngVue component can be done using the `v-directives` attribute assigning it a string, directive bindings or array of bindings:

```html
<!-- string -->
<my-component v-directives="'greeting'"></my-component>

<!-- Accepts comma separated string -->
<my-component v-directives="'greeting,focus'"></my-component>

<!-- Binding object -->
<my-component
  v-directives="{
    name: 'greeting',
    value: 'Hello World',
    arg: 'foo',
    modifiers: { shout: true, blink: true }
  }"
></my-component>

<!-- Array of binding objects -->
<my-component
  v-directives="[
    {name: 'greeting', value: 'Hello World'},
    {name: 'focus'}
  ]"
></my-component>
```

The bindings passed to the ngVue are the same bindings passed to the directives lifecycle hooks.

| Property    | Type                      | Equivalent                 | Description                                       |
| ----------- | ------------------------- | -------------------------- | ------------------------------------------------- |
| `name`      | `string`                  | `v-greeting`               | Name of directive.                                |
| `value`     | `any`                     | `v-greeting="Hello World"` | Optional. The value passed to the directive       |
| `arg`       | `string`                  | `v-greeting:foo`           | Optional. The argument passed to the directive    |
| `modifiers` | `Record<string, boolean>` | `v-greeting.blink.warning` | Optional. An object containing modifiers, if any. |

## TODO

- [x] vue components
- [x] vue directives
- [x] unit tests
- [x] docs + examples (they're done just working on deploying them)
- [x] plugins
- ~~[x] Filters (won't do, vue 3 doesn't support global filters)~~
- [ ] support vuex (maybe?)
- [ ] support pinia
