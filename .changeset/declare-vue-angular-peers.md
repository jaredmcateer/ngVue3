---
"@jaredmcateer/ngvue3": patch
---

Declare `angular` and `vue` as peerDependencies so the library resolves them at runtime under strict package managers (e.g. pnpm with `hoist=false`). Fixes #45.
