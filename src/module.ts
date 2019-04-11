import { Module, Store } from 'vuex';
import { TypedBase }     from './base';


export abstract class TypedModule<S, R> extends TypedBase<S, any, R> {
  protected constructor(readonly name: string, state: S) {
    super(state);
  }

  $getDef(): Module<S, R> {
    const modules = {};
    for (const mn of Object.keys(this._modules)) {
      modules[mn] = this._modules[mn].$getDef();
    }
    return {
      state    : this.state,
      modules,
      mutations: this._mutations,
      actions  : this._actions,
      getters  : this._getters,
    };
  }

  $register(store: Store<R>, names: string[]) {
    this._store = store;
    this._names = names;
    for (const mn of Object.keys(this._modules)) {
      this._modules[mn].$register(this._store, [...this._names, mn]);
    }
  }
}

type IModuleConstructor = new(...args: any[]) => TypedModule<any, any>;


export function Module() {
  return <TBase extends IModuleConstructor>(Ctor: TBase) => {
    // In order to inherit the name of class.
    const wrapper      = {};
    wrapper[Ctor.name] = class extends Ctor {
      constructor(...args: any[]) {
        super(...args);
      }
    };
    return wrapper[Ctor.name];
  };
}
