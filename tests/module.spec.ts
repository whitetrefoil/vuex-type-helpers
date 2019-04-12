import Vue                                                           from 'vue';
import { default as Vuex }                                           from 'vuex';
import { Module, Store, TypedModule, TypedStore, TypedStoreOptions } from '../src';


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

    @Module()
    class TestModule extends TypedModule<IModuleState, IFullState> {
      constructor(state: IModuleState) {
        super(state);
      }
    }

    const testModule = new TestModule(moduleState);

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>('test', testModule);

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

    @Module()
    class TestModule extends TypedModule<IModuleState, IFullState> {
      itShouldWork = this.m('IT_SHOULD_WORK', (s, num: number) => {
        s.count = num;
      });

      constructor(state: IModuleState) {
        super(state);
      }
    }

    const testModule = new TestModule(moduleState);

    const rootState: IRootState = {};

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>('test', testModule);

      constructor(options: TypedStoreOptions<IRootState>) {
        super(options);
      }
    }

    const store = new TestStore({ state: rootState });

    store.test.itShouldWork(222);

    expect(store.test.state.count).toEqual(222);
    expect(store.test.itShouldWork.$name).toEqual('IT_SHOULD_WORK');
    expect(store.test.itShouldWork.$fullName()).toEqual('test/IT_SHOULD_WORK');
  });
});


describe('addActions', () => {
  it('should work', async() => {
    interface IModuleState {count: number;}

    interface IRootState {}

    type IFullState = IRootState&{ test: IModuleState }

    const moduleState: IModuleState = { count: 0 };

    @Module()
    class TestModule extends TypedModule<IModuleState, IFullState> {
      iAmAMutation = this.m('I_AM_A_MUTATION', (s, num: number) => {
        s.count = num;
      });

      itShouldWork = this.a('IT_SHOULD_WORK', async(s, num: number) => {
        this.iAmAMutation(num);
        return '???';
      });

      constructor(state: IModuleState) {
        super(state);
      }
    }

    const testModule = new TestModule(moduleState);

    const rootState: IRootState = {};

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>('test', testModule);

      constructor(options: TypedStoreOptions<IRootState>) {
        super(options);
      }
    }

    const store = new TestStore({ state: rootState });

    const returnValue = await store.test.itShouldWork(222);

    expect(store.test.state.count).toEqual(222);
    expect(returnValue).toEqual('???');
    expect(store.test.itShouldWork.$name).toEqual('IT_SHOULD_WORK');
    expect(store.test.itShouldWork.$fullName()).toEqual('test/IT_SHOULD_WORK');
  });
});


describe('addGetters', () => {
  it('should work', () => {

    interface IModuleState {count: number;}

    interface IRootState {}

    type IFullState = IRootState&{ test: IModuleState }

    const moduleState: IModuleState = { count: 0 };

    @Module()
    class TestModule extends TypedModule<IModuleState, IFullState> {
      itShouldWork = this.g('IT_SHOULD_WORK', s => s.count);

      constructor(state: IModuleState) {
        super(state);
      }
    }

    const testModule = new TestModule(moduleState);

    const rootState: IRootState = {};

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>('test', testModule);

      constructor(options: TypedStoreOptions<IRootState>) {
        super(options);
      }
    }

    const store = new TestStore({ state: rootState });

    const result = store.test.itShouldWork();

    expect(result).toBe(0);
    expect(store.test.itShouldWork.$name).toEqual('IT_SHOULD_WORK');
    expect(store.test.itShouldWork.$fullName()).toEqual('test/IT_SHOULD_WORK');
  });

  it('should work as function pattern', () => {

    interface IModuleState {count: number;}

    interface IRootState {}

    type IFullState = IRootState&{ test: IModuleState }

    const moduleState: IModuleState = { count: 0 };

    @Module()
    class TestModule extends TypedModule<IModuleState, IFullState> {
      itShouldWork = this.g('GET_NEXT_COUNT', s => (step: number) => s.count + step);

      constructor(state: IModuleState) {
        super(state);
      }
    }

    const testModule = new TestModule(moduleState);

    const rootState: IRootState = {};

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>('test', testModule);

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

    @Module()
    class TestModule extends TypedModule<IModuleState, IFullState> {
      getCurrentCount = this.g('GET_CURRENT_COUNT', s => s.count);
      getNextCount    = this.g('GET_NEXT_COUNT', s => this.getCurrentCount() + 1);

      constructor(state: IModuleState) {
        super(state);
      }
    }

    const testModule = new TestModule(moduleState);

    const rootState: IRootState = {};

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>('test', testModule);

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

    @Module()
    class TestModule extends TypedModule<IModuleState, IFullState> {
      getCurrentCount = this.g('GET_CURRENT_COUNT', s => s.count);
      getNextCount    = this.g('GET_NEXT_COUNT', (s, g) => g[this.getCurrentCount.$name] + 1);

      constructor(state: IModuleState) {
        super(state);
      }
    }

    const testModule = new TestModule(moduleState);

    const rootState: IRootState = {};

    @Store()
    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>('test', testModule);

      constructor(options: TypedStoreOptions<IRootState>) {
        super(options);
      }
    }

    const store = new TestStore({ state: rootState });

    const result = store.test.getNextCount();

    expect(result).toBe(1);
  });
});


describe('deepModule', () => {
  it('should work', () => {
    interface IState1 {state1: string}

    interface IState2 {state2: string}

    interface IState3 {state3: string}

    type IFullState = IState1&{ store2: IState2&{ store3: IState3 } }

    const state1: IState1 = { state1: 'state1' };
    const state2: IState2 = { state2: 'state2' };
    const state3: IState3 = { state3: 'state3' };

    @Module()
    class Store3 extends TypedModule<IState3, IFullState> {
      getter3From1 = this.g('GETTER_3_FROM_1', (s, g, rs, rg) => rg['GETTER_1']);
      mutation3    = this.m('MUTATION_3', state => state.state3 = 'mutated_state3');

      constructor(state: IState3) {
        super(state);
      }
    }

    const store3 = new Store3(state3);

    @Module()
    class Store2 extends TypedModule<IState2, IFullState> {
      mutation2 = this.m('MUTATION_2', state => state.state2 = 'mutated_state2');
      store3    = this.r<IState3, Store3>('store3', store3);

      constructor(state: IState2) {
        super(state);
      }
    }

    const store2 = new Store2(state2);

    @Store()
    class Store1 extends TypedStore<IState1, IFullState> {
      getter1 = this.g('GETTER_1', state => state.state1);

      store2 = this.r<IState2, Store2>('store2', store2);

      constructor(options: TypedStoreOptions<IState1>) {
        super(options);
      }
    }

    const store1 = new Store1({ state: state1 });

    expect(store3.state.state3 = 'state3');
    expect(store3.mutation3.$name).toEqual('MUTATION_3');
    expect(store3.mutation3.$fullName()).toEqual('store2/store3/MUTATION_3');
    expect(store2.mutation2.$name).toEqual('MUTATION_2');
    expect(store2.mutation2.$fullName()).toEqual('store2/MUTATION_2');
    expect(store1.getter1()).toEqual('state1');
    expect(store3.getter3From1()).toEqual('state1');
  });
});
