# Plugins

In its predecessor ngVue provided means of adding properties to the root instance of the Vue instance and allowed you to hook into lifecycle methods. Vue 3 has negated the need for a lot of the functionality provided. Now you can create [Composables](https://vuejs.org/guide/reusability/composables.html) with lifecycle hooks and properties you want to make accessible to your components. But what if you want to add plugins or injectables to your app instance? What if you need to share logic between angular and vue land? ngVue3's plugin system provides you means to do so.

## Usage

Much like the root `ngVue` module you can add the `ngVuePlugins` module to your angular app using `useNgVuePlugins()`

```ts
import angular from "angular";
import { useNgVue, useNgVuePlugins } from "@jaredmcateer/ngvue3";

angular.module("mainApp", [useNgVue(), useNgVuePlugins()]);
```

## The `$ngVueProvider` factory

`useNgVuePlugins` creates an Angular service `$ngVue`. This service implements a custom plugins system and a means to pass through Injectables and Plugins to the Vue app instance.

### Provide/Use/Directives/Global Components

Sometimes you simply need to add a plugin, injectable or directive to the app instance, you don't have any specific need for angular but due to ngVue's architecture the app instance isn't readily available, `$ngVueProvider` has pass through function to help you with that.

_Example using TypeScript_

```ts
import { type NgVueProvider } from "@jaredmcateer/ngvue3";
import MyGlobalComponent from "./components/MyGlobalComponent.vue";
const fooKey: InjectionKey<"bar"> = new Symbol();

angular
  .module("mainApp", [useNgVue(), useNgVuePlugins()])
  .config(($ngVueProvider: NgVueProvider) => {
    $ngVueProvider.use(MyPlugin);

    $ngVueProvider.provide("foo", "bar");
    // You can also pass symbols as InjectionKeys for better type inference in your components.
    $ngVueProvider.provide(fooKey, "bar");

    $ngVueProvider.directive("focus", {
      onMounted(el) {
        el.focus();
      },
    });

    // Register global component
    $ngVueProvider.component("myGlobalComponent", MyGlobalComponent);
  });
```

<details><summary><strong>Equivalent using JavaScript</strong></summary>

```javascript
import MyGlobalComponent from "./components/MyGlobalComponent.vue";
export const fooKey = Symbol();

angular.module("mainApp", [useNgVue(), useNgVuePlugins()]).config(($ngVueProvider) => {
  $ngVueProvider.use(MyPlugin);

  $ngVueProvider.provide("foo", "bar");
  $ngVueProvider.provide(fooKey, "bar");

  $ngVueProvider.directive("focus", {
    onMounted(el) {
      el.focus();
    },
  });

  // Register global component
  $ngVueProvider.component("myGlobalComponent", MyGlobalComponent);
});
```

</details>

<hr>

### ngVue Plugins

Sometimes you need a bit more, ngVue plugins are special configurations which allow for configuring data during the bootstrapping of your Angular app and providing access to the Angular injector in your Vue plugin's install method.

#### Writing an ngVue Plugin

During the configuration phase of Angular you can access the ngVue Provider:

| Property | type     | Description                                                                                                       |
| -------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| \$name   | string   | plugin namespace                                                                                                  |
| \$plugin | function | Passes in Angular Injector and Vue app instance for use in crafting a Vue plugin                                  |
| \$config | object   | This objects properties/methods gets added on to the `NgVueProvider` under `$ngVueProvider.plugins.<$name>.<...>` |

_Example using TypeScript_

```ts
import angular from "angular";
import { useNgVue, useNgVuePlugins } from "@jaredmcateer/ngvue3";
import { Plugin } from "vue";
import { MyService } from "services/MyService";

angular.module("custom.plugin", [useNgVuePlugin()]).config(($ngVueProvider: NgVueProvider) => {
  $ngVueProvider.install(() => ({
    $name: "myPlugin",
    $plugin: ($injector: ng.auto.IInjectorService, app: App<any>) => {
      const customVuePlugin: Plugin = {
        install(app, options) {
          // Vue plugin stuff with access to the injector
          const myService = $inject.get<MyService>("myService");
          app.provide("foo", myServer.getFoo());
          // or app.component(...)
          // or app.directive(...)
          // or app.config.globalProperties
          // or some combination of all 4
        },
      };
      app.use(customVuePlugin);
    },
    $config: {
      /* ... */
      foo() {
        /* ... */
      },
    },
  }));
});
```

<details><summary><strong>Equivalent using JavaScript<strong></summary>

```ts
import angular from "angular";
import { useNgVue, useNgVuePlugins } from "@jaredmcateer/ngvue3";

angular.module("custom.plugin", [useNgVuePlugin()]).config(($ngVueProvider) => {
  $ngVueProvider.install(() => ({
    $name: "myPlugin",
    $plugin: ($injector, app) => {
      const customVuePlugin = {
        install(app, options) {
          // Vue plugin stuff with access to the injector
          const myService = $inject.get("myService");
          app.provide("foo", myServer.getFoo());
          // or app.component(...)
          // or app.directive(...)
          // or app.config.globalProperties
          // or some combination of all 4
        },
      };
      app.use(customVuePlugin);
    },
    $config: {
      /* ... */
      foo() {
        /* ... */
      },
    },
  }));
});
```

</details>

<hr>

#### Configuring a plugin

Each ngVue plugin has a namespace object (defined by `$name`) and all the configuration options are contained there on the `$ngVueProvider`, using the example from above:

```ts
angular
  .module("mainApp", [useNgVuePlugins(), "custom.plugin"])
  .config(($ngVueProvider: NgVueProvider) => {
    $ngVueProvider.plugins.myPlugin.foo();
  });
```

### Example: Vuex 4

Vuex support is a bit opinionated and its implementation focuses on simplicity. You must pass it to the app instance `app.use(Vuex)` to enable automatic injection of the store into child components. Then, import (or define) your Vuex.Store instance and tell ngVue to use it on all Vue instances created by it.

```ts
// store.js

import { createApp } from "vue";
import { createStore } from "vuex";

// Create a new store instance.
export const store = createStore({
  state() {
    return {
      count: 0,
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});
```

```ts
import { store } from "./store";

angular
  .module("mainApp", [useNgVue(), useNgVuePlugins()])
  .config(($ngVueProvider: NgVueProvider) => {
    // Install the store instance as a plugin
    $ngVueProvider.use(store);
  });
```
