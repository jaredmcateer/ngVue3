# ngVue 3

This is the root workspace of the ngVue monorepo, the primary readme can be found in the [packages/ngVue3](./packages/ngVue3/README.md) package workspace.

## TODO

- [x] ngVue3 library

  - [x] directive
    - [x] createVueComponent
  - [x] linker
    - [x] extracting v-props
    - [x] extracting v-directives
    - [x] extracting attrs
    - [x] extracting events
    - [x] initializing state
    - [x] creating vue app instance
    - [x] Is watch depth necessary? (yes)
    - [ ] Support quirks mode? (probably wont do)
  - [x] Plugins
    - [ ] Filters (probably wont do)
    - [ ] Vuex ? (probably wont do)
    - [ ] Pinia ?
  - [x] Tests

- [x] Demo page

  - [x] Options
  - [x] SFC (setup method)
  - [x] SFC (script setup)
  - [ ] Native Vue Plugins
  - [ ] Directives
  - [ ] Provide/Inject
  - [ ] NgVue Plugins
  - [ ] Depoly

- [ ] Documentation
  - [ ] Repo README (this)
  - [ ] Wiki

## BREAKING CHANGES

- `<vue-component name="" ...>` not supported
- Don't need to have a parent element as Vue 3 uses the component container
  - This allows for multi-root templates
  - No longer requires a wrapper element
  - ngVue 3 will strip the attrs from the parent with the exceptions:
    - vue adds `v-data-app`
    - angular may add `class="ng-scope"`
  - `class` and `style` will fall through
    - If you have a multi-root template you need to use `v-bind="$attr"` on an element otherwise a warning will be generated
  - `ng-class` and `ng-style` will not
