// tslint:disable-next-line:no-implicit-dependencies
import { VueConstructor } from 'vue';
import Vuex, { Plugin }   from 'vuex';
import { TypedBase }      from './base';


export interface ITypedStoreOptions<R> {
  state: R;
  plugins?: Plugin<R>[];
  strict?: boolean;
  devtools?: boolean;
}


export abstract class TypedStore<R, F extends R> extends TypedBase<R, R, F> {
  protected readonly _names: string[] = [];
  private readonly _plugins: Plugin<R>[];
  private readonly _strict: boolean;
  private readonly _devtools: boolean;

  protected constructor(options: ITypedStoreOptions<R>) {
    super(options.state);
    this._plugins  = options.plugins || [];
    this._strict   = options.strict || process.env.NODE_ENV === 'development';
    this._devtools = options.devtools || process.env.NODE_ENV === 'development';
  }

  protected $bootstrap(Vue: VueConstructor): this {
    const modules = {};
    for (const mn of Object.keys(this._modules)) {
      modules[mn] = this._modules[mn].$getDef();
    }

    const fullDef: any = {
      state    : this.state,
      modules,
      mutations: this._mutations,
      actions  : this._actions,
      getters  : this._getters,
      plugins  : this._plugins,
      strict   : this._strict,
      devtools : this._devtools,
    };

    Vue.use(Vuex);
    this._store = new Vuex.Store<any>(fullDef);

    for (const mn of Object.keys(this._modules)) {
      this._modules[mn].$register(this._store, [...this._names, mn]);
    }

    return this;
  }
}

type IStoreConstructor = new(...args: any[]) => TypedStore<any, any>;

export function Store(Vue: VueConstructor) {
  return <TBase extends IStoreConstructor>(Ctor: TBase) => {
    // In order to inherit the name of class.
    const Klass = class extends Ctor {
      constructor(...args: any[]) {
        super(...args);
        this.$bootstrap(Vue);
      }
    };

    Object.defineProperty(Klass, 'name', { value: name });

    return Klass as any;
  };
}
