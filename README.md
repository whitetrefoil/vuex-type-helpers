@whitetrefoil/vuex-type-helpers
===============================

Some tiny helpers to help vuex work with typescript.

It wraps the module definition with a helper class.

Using the methods of that class to define getters/mutations/actions.

Those methods will return type-checked functions
which proxy calling to the real store.

Those functions will also have two additional property:
`key` (w/ module name) & `fullKey` (w/o module name),
which are the actual key registered on the store.

Those keys (mostly `fullKey`) can be useful
if you want to use Vuex's helpers (e.g. `mapGetters`, `rootGetters`, etc.).

Usage
-----

### Install

```
npm i vue vuex @whitetrefoil/vuex-type-helpers
```
OR
```
yarn add vue vuex @whitetrefoil/vuex-type-helpers
```
Then
```ts
import TypedModule from '@whitetrefoil/vuex-type-helpers'
```

### Simple example

See `"/expamles"` dir.

### API

```
class TypedModule
```

Changelog
---------

### v0.7.0-beta.1

* Add a "mGetter" method to shorten method style getters.

### v0.6.0-alpha.1

* Enable namespace.

### v0.5.0-alpha.3

* Export interfaces.

### v0.5.0-alpha.2

* Fix package entry in package.json.

### v0.5.0-alpha.1

* Try a simpler new design (more like v0.3).

### v0.4.0

* Bind store during config (no more `this.$store` in arguments).

#### alpha.4

* Many optimization & workaround.

#### alpha.3

* Avoid using `.mjs` due to its wired behavior in Webpack.

#### alpha.2

* Enable namespace to support deeply nested module.

#### alpha.1

* Initial internal test version.

### v0.3.2

* Fix wrong codes in v0.3.1 which cause the type declaration not working.

### v0.3.1

* Fix type declaration of ActionContext.

### v0.3.0

* Typed getters now can accept an ActionContext.

### v0.2.0

* Modify `addGetter` callback function signature to match original Vuex getter.

### v0.1.3

* Fix error caused by wrong getter syntax.

### v0.1.2

* Switch to yarn.
* Add "addGetter".

### v0.1.1

* Add keywords in "package.json".
* Include ".mjs" file in delivery.
* Include "src" folder in delivery.

### v0.1.0

* First release.
