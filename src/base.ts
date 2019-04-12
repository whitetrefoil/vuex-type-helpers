// S = State
// R = RootState
// F = FullState (includes modules)

import { ActionContext, ActionTree, GetterTree, MutationTree, Store } from 'vuex';
import { TypedModule }                                                from './module';


export type IPayload<N, D> = D extends void ? undefined : {
  type: N;
  data: D;
};

export interface ITypedModuleTree<F> {
  [name: string]: TypedModule<any, F>;
}

export type IWithName<F extends Function> = F&{ $name: string; $fullName(): string };

export abstract class TypedBase<S, R, F extends R> {
  protected _names?: string[];
  protected _store?: Store<F>;
  protected readonly _actions: ActionTree<S, F>    = {};
  protected readonly _getters: GetterTree<S, F>    = {};
  protected readonly _modules: ITypedModuleTree<F> = {};
  protected readonly _mutations: MutationTree<S>   = {};

  protected constructor(public readonly state: S) {}

  protected get namespace(): string {
    if (this._names == null) {
      throw new Error('module not initialized yet!');
    }
    const joined = this._names.join('/');
    return joined.length > 0 ? `${joined}/` : '';
  }

  store(): Store<F> {
    if (this._store == null) {
      throw new Error('store not initialized');
    }
    return this._store;
  }

  protected prefix(name: string) {
    return this.namespace + name;
  }

  protected m<D = void>(
    name: string,
    mutation: (state: S, data: D) => void,
  ): IWithName<(data: D) => void> {
    this._mutations[name] = (state: S, payload: IPayload<typeof name, D>) =>
      payload == null ? (mutation as any)(state) : mutation(state, payload.data);

    const m = (data: D) => this.store().commit({
      type: this.prefix(name),
      data,
    });

    m.$name     = name;
    m.$fullName = () => this.namespace + name;

    return m;
  }

  protected a<D = void, RTN = void>(
    name: string,
    action: (context: ActionContext<S, R>, data: D) => Promise<RTN>,
  ): IWithName<(data: D) => Promise<RTN>> {
    this._actions[name] = (context: ActionContext<S, R>, payload: IPayload<typeof name, D>) =>
      payload == null ? (action as any)(context) : action(context, payload.data);

    const a = async(data: D): Promise<RTN> => this.store().dispatch({
      type: this.prefix(name),
      data,
    });

    a.$name     = name;
    a.$fullName = () => this.namespace + name;

    return a;
  }

  protected g<RTN>(
    name: string,
    getterFn: (state: S, getters: any, rootState: R, rootGetters: any) => RTN,
  ): IWithName<() => RTN> {
    this._getters[name] = getterFn;

    const g = () => this.store().getters[this.prefix(name)];

    g.$name     = name;
    g.$fullName = () => this.namespace + name;

    return g;
  }

  protected r<MS, M extends TypedModule<MS, F>>(name: string, module: M): M {
    this._modules[name] = module;
    return module;
  }
}
