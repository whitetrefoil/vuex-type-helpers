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

  $register(store: Store<R>) {
    this._store = store;
    for (const mn of Object.keys(this._modules)) {
      this._modules[mn].$register(this._store);
    }
  }
}
