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

export type IWithName<F extends Function> = F&{ $name: string; $fullName(): string };

export abstract class TypedBase<S, R, F extends R> {
  protected _names: string[]                       = [];
  protected _store?: Store<F>;
  protected readonly _actions: ActionTree<S, F>    = {};
  protected readonly _getters: GetterTree<S, F>    = {};
  protected readonly _modules: ITypedModuleTree<F> = {};
  protected readonly _mutations: MutationTree<S>   = {};

  protected constructor(public readonly state: S) {}

  protected get namespace(): string {
    const joined = this._names.join('/');
    return joined.length > 0 ? `${joined}/` : '';
  }

  store(): Store<F> {
    if (this._store == null) {
      throw new Error('store not initialized');
    }
    return this._store;
  }

  protected m<D = void>(
    name: string,
    mutation: (state: S, data: D) => void,
  ): IWithName<(data: D) => void> {
    this._mutations[name] = (state: S, payload: IPayload<typeof name, D>) => mutation(this.state, payload.data);

    const m = (data: D) => this.store().commit({
      type: name,
      data,
    });

    m.$name = name;
    m.$fullName = () => this.namespace + name;

    return m;
  }

  protected a<D = void, RTN = void>(
    name: string,
    action: (context: ActionContext<S, R>, data: D) => Promise<RTN>,
  ): IWithName<(data: D) => Promise<RTN>> {
    this._actions[name] = (context: ActionContext<S, R>, payload: { type: typeof name; data: D }) => action(
      context,
      payload.data,
    );

    const a = async(data: D): Promise<RTN> => this.store().dispatch({
      type: name,
      data,
    });

    a.$name = name;
    a.$fullName = () => this.namespace + name;

    return a;
  }

  protected g<RTN>(
    name: string,
    getterFn: (state: S, getters: any, rootState: R, rootGetters: any) => RTN,
  ): IWithName<() => RTN> {
    this._getters[name] = getterFn;

    const g = () => this.store().getters[name];

    g.$name = name;
    g.$fullName = () => this.namespace + name;

    return g;
  }

  protected r<MS, M extends TypedModule<MS, F>>(module: M): M {
    this._modules[module.name] = module;
    return module;
  }
}
