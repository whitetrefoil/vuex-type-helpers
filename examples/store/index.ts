import { Vue }                    from 'av-ts';
import { default as Vuex, Store } from 'vuex';
import { DebugStore }             from './debug';

export interface RootState {
  // Since `vuex-type-helpers` can only manage modules,
  // just keep the root state empty is enough.
}

export interface FullState extends RootState {
  // Root state + modules' states.
  debug: DebugStore.State;
}


const state: RootState = {};


Vue.use(Vuex);


export const store = new Store({
  // Have to manually declare it as a full state to get a `Store<FullState>`
  state: state as FullState,

  // Modules will be registered lazily
  // when imported by components (or other code),
  // no need to declare here.
});
