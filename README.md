## TODO

- [ ] ngVue3 library

  - [x] directive
    - [x] createVueComponent
  - [x] linker
    - [x] extracting v-props
    - [ ] extracting v-directives
    - [x] extracting attrs
    - [x] extracting events
    - [x] initializing state
    - [x] creating vue app instance
    - [ ] importing "global" filters
    - [x] Is watch depth necessary? (yes)
    - [ ] Support quirks mode?
  - [ ] Plugins
    - [ ] Filters
    - [ ] Vuex ?
    - [ ] Pinia ?
  - [ ] Tests

- [ ] Demo page

  - [ ] Options
  - [ ] SFC (setup method)
  - [ ] SFC (script setup)

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
