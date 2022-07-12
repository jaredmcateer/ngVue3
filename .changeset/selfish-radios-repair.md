---
"@jaredmcateer/ngvue3": patch
---

Fixed component name inference

Previously if the name property of components was missing it would default to `UnnamedComponent`. This made it difficult to search for components in Vue Devtools since you would just get a list of `NgVue-UnnamedComponent` in the list.

This change will first attempt the name property, then it will use the file path and failing that it will name the component `AnonymousComponent`. This is more inline with the Vue 3 logic for determining component names.
