import Vue                                                   from 'vue';
import { default as Vuex }                                   from 'vuex';
import { Store, TypedModule, TypedStore, TypedStoreOptions } from '../src';


jest.resetModules();


beforeAll(() => {
  Vue.use(Vuex);
});


describe('TypedModule', () => {

  it('should work', () => {

    interface IModuleState {count: number;}

    interface IRootState {}

    type IFullState = IRootState&{ test: IModuleState }

    const moduleState: IModuleState = { count: 0 };

    class TestModule extends TypedModule<IModuleState, IFullState> {
      constructor(state: IModuleState) {
        super('test', state);
      }
    }

    const testModule = new TestModule(moduleState);

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>(testModule);

      constructor(options: TypedStoreOptions<{}>) {
        super(options);
      }
    }

    const store = new TestStore({
      state: {},
    });

    expect(store instanceof TypedStore).toBeTruthy();
    expect(store instanceof TestStore).toBeTruthy();
    expect(testModule instanceof TypedModule).toBeTruthy();
    expect(testModule instanceof TestModule).toBeTruthy();
  });
});


describe('addMutations', () => {

  it('should work', () => {

    interface IModuleState {count: number;}

    interface IRootState {}

    type IFullState = IRootState&{ test: IModuleState }

    const moduleState: IModuleState = { count: 0 };

    class TestModule extends TypedModule<IModuleState, IFullState> {
      itShouldWork = this.m('IT_SHOULD_WORK', (s, num: number) => {
        s.count = num;
      });

      constructor(state: IModuleState) {
        super('test', state);
      }
    }

    const testModule = new TestModule(moduleState);

    const rootState: IRootState = {};

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>(testModule);

      constructor(options: TypedStoreOptions<IRootState>) {
        super(options);
      }
    }

    const store = new TestStore({ state: rootState });

    store.test.itShouldWork(222);

    expect(store.test.state.count).toEqual(222);
    expect(store.test.itShouldWork.$raw).toEqual('IT_SHOULD_WORK');
  });
});


describe('addActions', () => {
  it('should work', async() => {
    interface IModuleState {count: number;}

    interface IRootState {}

    type IFullState = IRootState&{ test: IModuleState }

    const moduleState: IModuleState = { count: 0 };

    class TestModule extends TypedModule<IModuleState, IFullState> {
      iAmAMutation = this.m('I_AM_A_MUTATION', (s, num: number) => {
        s.count = num;
      });

      itShouldWork = this.a('IT_SHOULD_WORK', async(s, num: number) => {
        this.iAmAMutation(num);
        return '???';
      });

      constructor(state: IModuleState) {
        super('test', state);
      }
    }

    const testModule = new TestModule(moduleState);

    const rootState: IRootState = {};

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>(testModule);

      constructor(options: TypedStoreOptions<IRootState>) {
        super(options);
      }
    }

    const store = new TestStore({ state: rootState });

    const returnValue = await store.test.itShouldWork(222);

    expect(store.test.state.count).toEqual(222);
    expect(returnValue).toEqual('???');
    expect(store.test.itShouldWork.$raw).toEqual('IT_SHOULD_WORK');
  });
});


describe('addGetters', () => {
  it('should work', () => {

    interface IModuleState {count: number;}

    interface IRootState {}

    type IFullState = IRootState&{ test: IModuleState }

    const moduleState: IModuleState = { count: 0 };

    class TestModule extends TypedModule<IModuleState, IFullState> {
      itShouldWork = this.g('IT_SHOULD_WORK', s => s.count);

      constructor(state: IModuleState) {
        super('test', state);
      }
    }

    const testModule = new TestModule(moduleState);

    const rootState: IRootState = {};

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>(testModule);

      constructor(options: TypedStoreOptions<IRootState>) {
        super(options);
      }
    }

    const store = new TestStore({ state: rootState });

    const result = store.test.itShouldWork();

    expect(result).toBe(0);
    expect(store.test.itShouldWork.$raw).toEqual('IT_SHOULD_WORK');
  });

  it('should work as function pattern', () => {

    interface IModuleState {count: number;}

    interface IRootState {}

    type IFullState = IRootState&{ test: IModuleState }

    const moduleState: IModuleState = { count: 0 };

    class TestModule extends TypedModule<IModuleState, IFullState> {
      itShouldWork = this.g('GET_NEXT_COUNT', s => (step: number) => s.count + step);

      constructor(state: IModuleState) {
        super('test', state);
      }
    }

    const testModule = new TestModule(moduleState);

    const rootState: IRootState = {};

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>(testModule);

      constructor(options: TypedStoreOptions<IRootState>) {
        super(options);
      }
    }

    const store = new TestStore({ state: rootState });

    const result = store.test.itShouldWork()(10);

    expect(result).toBe(10);
  });

  it('can call another getter', () => {

    interface IModuleState {count: number;}

    interface IRootState {}

    type IFullState = IRootState&{ test: IModuleState }

    const moduleState: IModuleState = { count: 0 };

    class TestModule extends TypedModule<IModuleState, IFullState> {
      getCurrentCount = this.g('GET_CURRENT_COUNT', s => s.count);
      getNextCount    = this.g('GET_NEXT_COUNT', s => this.getCurrentCount() + 1);

      constructor(state: IModuleState) {
        super('test', state);
      }
    }

    const testModule = new TestModule(moduleState);

    const rootState: IRootState = {};

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>(testModule);

      constructor(options: TypedStoreOptions<IRootState>) {
        super(options);
      }
    }

    const store = new TestStore({ state: rootState });

    const result = store.test.getNextCount();

    expect(result).toBe(1);
  });

  it('can call another getter via raw API (no type check)', () => {

    interface IModuleState {count: number;}

    interface IRootState {}

    type IFullState = IRootState&{ test: IModuleState }

    const moduleState: IModuleState = { count: 0 };

    class TestModule extends TypedModule<IModuleState, IFullState> {
      getCurrentCount = this.g('GET_CURRENT_COUNT', s => s.count);
      getNextCount    = this.g('GET_NEXT_COUNT', (s, g) => g[this.getCurrentCount.$raw] + 1);

      constructor(state: IModuleState) {
        super('test', state);
      }
    }

    const testModule = new TestModule(moduleState);

    const rootState: IRootState = {};

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>(testModule);

      constructor(options: TypedStoreOptions<IRootState>) {
        super(options);
      }
    }

    const store = new TestStore({ state: rootState });

    const result = store.test.getNextCount();

    expect(result).toBe(1);
  });
});
