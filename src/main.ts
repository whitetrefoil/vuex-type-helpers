import { ActionContext, GetterTree, Store } from 'vuex';

export function addGetter<S, R, D>(
  tree: GetterTree<S, R>,
  name: string,
  getterFn: (state: S, getters: any, rootState: R, rootGetters: any) => D,
): (store: Store<R>|ActionContext<any, R>) => D {
  tree[name] = getterFn;

  return store => (store as ActionContext<S, R>).rootGetters == null
    ? (store as Store<R>).getters[name]
    : (store as ActionContext<any, R>).rootGetters[name];
}
