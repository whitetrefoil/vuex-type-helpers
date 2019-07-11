import { ActionContext, ActionTree, GetterTree, Module, MutationTree, Store } from 'vuex';


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
  fullKey: string;
  (data: D): void;
}

export interface VuexAction<S, R, D> {
  (ctx: ActionContext<S, R>, payload: StandardPayload<D>): Promise<void>;
}

export interface BoundAction<D> {
  key: string;
  fullKey: string;
  (data: D): Promise<void>;
}

export interface VuexGetter<S, R, D> {
  (state: S, getters: any, rootState: R, rootGetters: any): D;
}

export interface BoundGetter<D> {
  key: string;
  fullKey: string;
  (): D;
}

export interface BoundMethodGetter<D, P> {
  key: string;
  fullKey: string;
  (arg: P): D;
}


export class TypedModule<S, R> {

  public readonly store: Store<R>;
  public readonly fullName: string;
  protected bound                                  = false;
  protected readonly mutationTree: MutationTree<S> = {};
  protected readonly actionTree: ActionTree<S, R>  = {};
  protected readonly getterTree: GetterTree<S, R>  = {};

  constructor(
    public parent: Store<R>|TypedModule<any, R>,
    public readonly name: string,
    public readonly state: S,
  ) {
    if (parent instanceof TypedModule) {
      this.store    = parent.store;
      this.fullName = `${parent.fullName}/${name}`;
    } else {
      this.store    = parent;
      this.fullName = name;
    }
  }

  get def(): Module<S, R> {
    return {
      namespaced: true,
      state     : this.state,
      mutations : this.mutationTree,
      actions   : this.actionTree,
      getters   : this.getterTree,
    };
  }

  mutation<D = void>(key: string, vfn: VuexMutation<S, D>): BoundMutation<D> {
    this.mutationTree[key] = vfn;
    const fullKey          = `${this.fullName}/${key}`;

    const fn = (data: D) => {
      if (this.bound !== true) {
        console.warn('Not bind to a store yet!');
      }
      return this.store.commit({
        type: fullKey,
        data,
      });
    };

    fn.key     = key;
    fn.fullKey = fullKey;

    return fn;
  }

  action<D = void>(key: string, vfn: VuexAction<S, R, D>): BoundAction<D> {
    this.actionTree[key] = vfn;
    const fullKey        = `${this.fullName}/${key}`;

    const fn = (data: D) => {
      if (this.bound !== true) {
        console.warn('Not bind to a store yet!');
      }
      return this.store.dispatch({
        type: fullKey,
        data,
      });
    };

    fn.key     = key;
    fn.fullKey = fullKey;

    return fn;
  }

  getter<D>(key: string, vfn: VuexGetter<S, R, D>): BoundGetter<D> {
    this.getterTree[key] = vfn;
    const fullKey        = `${this.fullName}/${key}`;

    const fn = () => this.store.getters[fullKey];

    fn.key     = key;
    fn.fullKey = fullKey;

    return fn;
  }

  mGetter<D, P>(key: string, vfn: VuexGetter<S, R, (arg: P) => D>): BoundMethodGetter<D, P> {
    this.getterTree[key] = vfn;
    const fullKey        = `${this.fullName}/${key}`;

    const fn = (arg: P) => this.store.getters[fullKey](arg);

    fn.key     = key;
    fn.fullKey = fullKey;

    return fn;
  }

  finish() {
    this.store.registerModule(this.fullName.split('/'), this.def);
    this.bound = true;
  }
}

export default TypedModule;
