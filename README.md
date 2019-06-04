@whitetrefoil/vuex-type-helpers
===============================

Some tiny helpers to help vuex work with typescript.

Usage
-----

### Important

* **DO NOT** enable namespace mode in Vuex.

### Simple example

**TODO**

Changelog
---------

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
