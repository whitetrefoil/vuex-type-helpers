@whitetrefoil/vuex-type-helpers
===============================

Some tiny helpers to help vuex work with typescript.

Usage
-----

### Important

* **DO NOT** enable namespace mode in Vuex.

### Simple example

```ts
// State
export interface IHelloState {
    count: number
}

export const state: IHelloState = {
    count: 0,
}


// Mutations
export const mutations: MutationTree<IHelloState> = {}

export const setCount = addMutation(
    mutations,
    'SET_COUNT',
    (state, count: number) => {
        state.count = count
    },
)


// Actions
export const actions: ActionTree<IHelloState, IRootState> = {}

export const countOne = addAction(
    actions,
    'COUNT_ONE',
    async({ state, commit }) => {
        await doSomethingAsync()
        commit(setCount(state.count + 1))
    },
)


// Getters
export const getters: GetterTree<IHelloState, IRootState> = {}

export const getCounts = addGetter(
    getters,
    'GET_COUNTS',
    (state/*, getters, rootState, rootGetters*/) => state.count,
)

export const getNextCount = addGetter(
    getters,
    'GET_NEXT_COUNT',
    (state/*, getters, rootState, rootGetters*/) => (step: number) => state.count + step,
)


// Somewhere else
await store.dispatch(countOne())
console.log(getCounts(store))
console.log(getNextCount(store)(2))

const anotherAction = addAction(
    actions,
    'ANOTHER_ACTION',
    async(ctx) => {
        const c = getNextCount(ctx) // typed getter can accept an ActionContext also.
        commit(setCount(c))
    },
)
```


Changelog
---------

### v0.4.0

* Bind store during config (no more `this.$store` in arguments).

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
