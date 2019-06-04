import { ActionContext, ActionTree, GetterTree, MutationTree, Store } from 'vuex';


export interface StandardPayload<D> {
  type: string;
  data: D;
}

export interface PayloadCreator<D = void> {
  (data: D): StandardPayload<D>;
}


export interface VuexMutation<S, D> {
  (state: S, payload: StandardPayload<D>): void;
}

export interface BoundMutation<D> {
  key: string;
  (data: D): void;
}

export interface VuexAction<S, R, D> {
  (ctx: ActionContext<S, R>, payload: StandardPayload<D>): Promise<void>;
}

export interface BoundAction<D> {
  key: string;
  (data: D): Promise<void>;
}

export interface VuexGetter<S, R, D> {
  (state: S, getters: any, rootState: R, rootGetters: any): D;
}

export interface BoundGetter<D> {
  key: string;
  (): D;
}


export class TypedModule<S, R> {

  protected bound = false;

  protected readonly mutationTree: MutationTree<S> = {};
  protected readonly actionTree: ActionTree<S, R>  = {};
  protected readonly getterTree: GetterTree<S, R>  = {};

  constructor(public store: Store<R>, public readonly name: string, protected readonly state: S) {}

  mutation<D = void>(key: string, vfn: VuexMutation<S, D>): BoundMutation<D> {
    this.mutationTree[key] = vfn;

    const fn = (data: D) => {
      if (this.bound !== true) {
        console.warn('Not bind to a store yet!');
      }
      return this.store.commit({
        type: key,
        data,
      });
    };

    fn.key = key;

    return fn;
  }

  action<D = void>(key: string, vfn: VuexAction<S, R, D>): BoundAction<D> {
    this.actionTree[key] = vfn;

    const fn = (data: D) => {
      if (this.bound !== true) {
        console.warn('Not bind to a store yet!');
      }
      return this.store.dispatch({
        type: key,
        data,
      });
    };

    fn.key = key;

    return fn;
  }

  getter<D>(key: string, vfn: VuexGetter<S, R, D>): BoundGetter<D> {
    this.getterTree[key] = vfn;

    const fn = () => this.store.getters[key];

    fn.key = key;

    return fn;
  }

  finish() {
    this.store.registerModule(this.name, {
      state    : this.state,
      mutations: this.mutationTree,
      actions  : this.actionTree,
      getters  : this.getterTree,
    });
    this.bound = true;
  }
}

export default TypedModule;
