// S = State
// R = RootState
// F = FullState (includes modules)

import { ActionContext, ActionTree, GetterTree, MutationTree, Store } from 'vuex';
import { TypedModule }                                                from './module';


export interface IPayload<N, D> {
  type: N;
  data: D;
}

export interface ITypedModuleTree<F> {
  [name: string]: TypedModule<any, F>;
}


export abstract class TypedBase<S, R, F extends R> {
  protected _store?: Store<F>;
  readonly _mutations: MutationTree<S>   = {};
  protected readonly _actions: ActionTree<S, F>    = {};
  protected readonly _getters: GetterTree<S, F>    = {};
  protected readonly _modules: ITypedModuleTree<F> = {};

  protected constructor(public readonly state: S) {}

  store(): Store<F> {
    if (this._store == null) {
      throw new Error('store not initialized');
    }
    return this._store;
  }

  protected m<D = void>(
    name: string,
    mutation: (state: S, data: D) => void,
  ): ((data: D) => void)&{ $raw: string } {
    this._mutations[name] = (state: S, payload: IPayload<typeof name, D>) => mutation(this.state, payload.data);

    const m = (data: D) => this.store().commit({
      type: name,
      data,
    });

    m.$raw = name;

    return m;
  }

  protected a<D = void, RTN = void>(
    name: string,
    action: (context: ActionContext<S, R>, data: D) => Promise<RTN>,
  ): ((data: D) => Promise<RTN>)&{ $raw: string } {
    this._actions[name] = (context: ActionContext<S, R>, payload: { type: typeof name; data: D }) => action(
      context,
      payload.data,
    );

    const a = async(data: D): Promise<RTN> => this.store().dispatch({
      type: name,
      data,
    });

    a.$raw = name;

    return a;
  }

  protected g<RTN>(
    name: string,
    getterFn: (state: S, getters: any, rootState: R, rootGetters: any) => RTN,
  ): (() => RTN)&{ $raw: string } {
    this._getters[name] = getterFn;

    const g = () => this.store().getters[name];

    g.$raw = name;

    return g;
  }

  protected r<MS, M extends TypedModule<MS, F>>(module: M): M {
    this._modules[module.name] = module;
    return module;
  }
}
