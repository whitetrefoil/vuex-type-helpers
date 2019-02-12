@whitetrefoil/vuex-type-helpers
===============================

Some tiny helpers to help vuex work with typescript.

Usage
-----

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

// Somewhere else
await store.dispatch(countOne())
```


Changelog
---------

### v0.1.1

* Add keywords in "package.json".
* Include ".mjs" file in delivery.
* Include "src" folder in delivery.

### v0.1.0

* First release.
