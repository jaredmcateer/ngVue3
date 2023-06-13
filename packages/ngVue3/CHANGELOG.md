# @jaredmcateer/ngvue3

## 0.5.0

### Minor Changes

- [#37](https://github.com/jaredmcateer/ngVue3/pull/37) [`89ea165`](https://github.com/jaredmcateer/ngVue3/commit/89ea165f6516d1b10e3ce72e6cdfdbfd99c6f5d2) Thanks [@jaredmcateer](https://github.com/jaredmcateer)! - Adds support for global components

## 0.4.0

### Minor Changes

- [#34](https://github.com/jaredmcateer/ngVue3/pull/34) [`e8366e1`](https://github.com/jaredmcateer/ngVue3/commit/e8366e175e7a05431dbe1a2a44c3958aa70c5b45) Thanks [@jaredmcateer](https://github.com/jaredmcateer)! - Adding InjectionKey support to \$ngVueProvider.provide

## 0.3.7

### Patch Changes

- [#31](https://github.com/jaredmcateer/ngVue3/pull/31) [`5bdc979`](https://github.com/jaredmcateer/ngVue3/commit/5bdc979299fee62dfe5c63f4e14f0aa3cea3dddc) Thanks [@gbarta-atex](https://github.com/gbarta-atex)! - Compatibility with angularjs < 1.5.0

## 0.3.6

### Patch Changes

- [#29](https://github.com/jaredmcateer/ngVue3/pull/29) [`38ce025`](https://github.com/jaredmcateer/ngVue3/commit/38ce025af41db556c33192b2240b16ad8c0c2e67) Thanks [@JordanHeinrichs](https://github.com/JordanHeinrichs)! - Fix memory leak

## 0.3.5

### Patch Changes

- [#26](https://github.com/jaredmcateer/ngVue3/pull/26) [`78cde59`](https://github.com/jaredmcateer/ngVue3/commit/78cde598fd4f61d2ea9283e57c173e6c1f89cb13) Thanks [@jaredmcateer](https://github.com/jaredmcateer)! - Fixed component name inference

  Previously if the name property of components was missing it would default to `UnnamedComponent`. This made it difficult to search for components in Vue Devtools since you would just get a list of `NgVue-UnnamedComponent` in the list.

  This change will first attempt the name property, then it will use the file path and failing that it will name the component `AnonymousComponent`. This is more inline with the Vue 3 logic for determining component names.

## 0.3.4

### Patch Changes

- [`68b769e`](https://github.com/jaredmcateer/ngVue3/commit/68b769eb2287935c03d1326e4f8323fa582e3ca2) Thanks [@jaredmcateer](https://github.com/jaredmcateer)! - Exposes NgVueProvider type through main module

* [#21](https://github.com/jaredmcateer/ngVue3/pull/21) [`c84b302`](https://github.com/jaredmcateer/ngVue3/commit/c84b3020a2dcd4ade9b76a3fc6471557f986d897) Thanks [@jaredmcateer](https://github.com/jaredmcateer)! - Use replaceChild on "slot" parent

## 0.3.3

### Patch Changes

- [`9ea3e7b`](https://github.com/jaredmcateer/ngVue3/commit/9ea3e7b62a9bc568d62908a611313ea5beafd026) Thanks [@jaredmcateer](https://github.com/jaredmcateer)! - Build UMD Package

  - Fixes build of UMD package
  - Updates documentation and demo page with UMD usage

## 0.3.2

### Patch Changes

- [`cce3ad1`](https://github.com/jaredmcateer/ngVue3/commit/cce3ad1da6a261bca8b053eb1b190a095c88ef56) Thanks [@jaredmcateer](https://github.com/jaredmcateer)! - Add deploy script for demo
  Also minify ngVue library output

## 0.3.1

### Patch Changes

- [`87e799d`](https://github.com/jaredmcateer/ngVue3/commit/87e799d6c9611e66965ca002e07a89e8539b17ed) Thanks [@jaredmcateer](https://github.com/jaredmcateer)! - Add missing license field to package.json

## 0.3.0

### Minor Changes

- [#8](https://github.com/jaredmcateer/ngVue3/pull/8) [`d48c2a0`](https://github.com/jaredmcateer/ngVue3/commit/d48c2a0a6ab389f442f00e8cde3a9ab6388f1244) Thanks [@jaredmcateer](https://github.com/jaredmcateer)! - Added directives support

## 0.2.0

### Minor Changes

- [#5](https://github.com/jaredmcateer/ngVue3/pull/5) [`452168f`](https://github.com/jaredmcateer/ngVue3/commit/452168f577e6af5945ba2f1f6e069184a1fab639) Thanks [@jaredmcateer](https://github.com/jaredmcateer)! - Adding plugins to ngVue 3!

  Also fix the documentation in the demo app.

## 0.1.1

### Patch Changes

- [`14a404b`](https://github.com/jaredmcateer/ngVue3/commit/14a404b6d9f2000759411012350687cea6de00d3) Thanks [@jaredmcateer](https://github.com/jaredmcateer)! - Adding readme to ngVue doc and preventing config from being published to npm

## 0.1.0

### Minor Changes

- [`ed79cee`](https://github.com/jaredmcateer/ngVue3/commit/ed79cee087f1474ab5ee744d6ead97651c32e5cf) Thanks [@jaredmcateer](https://github.com/jaredmcateer)! - Initial release

  This is the what could be considered the MVP of ngVue, it contains the majority of primary functionality. A Vue3 component can be created in an Angular 1.x app, props are reactive, watch depths can be set, events can be listened to, attrs fall though.
