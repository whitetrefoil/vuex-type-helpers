import { Plugin, Store as VuexStore } from 'vuex';
import { TypedBase }                  from './base';
import { ICtor }                      from './utils';


export interface ITypedStoreOptions<R> {
  state: R;
  plugins?: Plugin<R>[];
  strict?: boolean;
  devtools?: boolean;
}


export abstract class TypedStore<R, F extends R> extends TypedBase<R, R, F> {
  private readonly _plugins: Plugin<R>[];
  private readonly _strict: boolean;
  private readonly _devtools: boolean;

  protected constructor(options: ITypedStoreOptions<R>) {
    super(options.state);
    this._plugins  = options.plugins || [];
    this._strict   = options.strict || process.env.NODE_ENV === 'development';
    this._devtools = options.devtools || process.env.NODE_ENV === 'development';
  }

  protected $bootstrap(): this {
    const modules = {};
    for (const mn of Object.keys(this._modules)) {
      modules[mn] = this._modules[mn].$getDef();
    }

    this._store = new VuexStore<any>({
      state    : this.state,
      modules,
      mutations: this._mutations,
      actions  : this._actions,
      getters  : this._getters,
      plugins  : this._plugins,
      strict   : this._strict,
      devtools : this._devtools,
    } as any);

    for (const mn of Object.keys(this._modules)) {
      this._modules[mn].$register(this._store);
    }

    return this;
  }
}

export function Store<TBase extends ICtor<TypedStore<any, any>>>() {
  return (Ctor: TBase) => {
    // In order to inherit the name of class.
    const wrapper = {};
    wrapper[Ctor.name] = class extends Ctor {
      constructor(...args: any[]) {
        super(...args);
        this.$bootstrap();
      }
    };
    return wrapper[Ctor.name];
  };
}
