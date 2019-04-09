import Vue                                from 'vue';
import { default as Vuex }                from 'vuex';
import { TypedModule }                    from '../src';
import { ITypedStoreOptions, TypedStore } from '../src/store';


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

    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>(testModule);

      constructor(options: ITypedStoreOptions<{}>) {
        super(options);
        this.$bootstrap();
      }
    }

    const store = new TestStore({
      state: {},
    });

    expect(store instanceof TypedStore).toBeTruthy();
    expect(testModule instanceof TypedModule).toBeTruthy();
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

    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>(testModule);

      constructor(options: ITypedStoreOptions<IRootState>) {
        super(options);
        this.$bootstrap();
      }
    }

    const store = new TestStore({ state: rootState });

    store.test.itShouldWork(222);

    expect(store.test.state.count).toEqual(222);
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

    class TestStore extends TypedStore<IRootState, IFullState> {
      test = this.r<IModuleState, TestModule>(testModule);

      constructor(options: ITypedStoreOptions<IRootState>) {
        super(options);
        this.$bootstrap();
      }
    }

    const store = new TestStore({ state: rootState });

    const returnValue = await store.test.itShouldWork(222);

    expect(store.test.state.count).toEqual(222);
    expect(returnValue).toEqual('???');
  });
});


// describe('addGetters', () => {
//   it('should work', () => {
//
//     const state = { count: 0 };
//
//     class TestStore extends TypedStore<typeof state> {
//       itShouldWork = this.g('IT_SHOULD_WORK', s => s.count);
//
//       constructor(options: ITypedStoreOptions<typeof state>) {
//         super(options);
//         this.$bootstrap();
//       }
//     }
//
//     const store = new TestStore({ state });
//
//     const result = store.itShouldWork();
//
//     expect(result).toBe(0);
//   });
//
//   it('should work as function pattern', () => {
//
//     const state = { count: 0 };
//
//     class TestStore extends TypedStore<typeof state> {
//       itShouldWork = this.g('GET_NEXT_COUNT', s => (step: number) => s.count + step);
//
//       constructor(options: ITypedStoreOptions<typeof state>) {
//         super(options);
//         this.$bootstrap();
//       }
//     }
//
//     const store = new TestStore({ state });
//
//     const result = store.itShouldWork()(10);
//
//     expect(result).toBe(10);
//   });
//
//   it('can call another getter', () => {
//
//     const state = { count: 0 };
//
//     class TestStore extends TypedStore<typeof state> {
//       getCurrentCount = this.g('GET_CURRENT_COUNT', s => s.count);
//       getNextCount    = this.g('GET_NEXT_COUNT', s => this.getCurrentCount() + 1);
//
//       constructor(options: ITypedStoreOptions<typeof state>) {
//         super(options);
//         this.$bootstrap();
//       }
//     }
//
//     const store = new TestStore({ state });
//
//     const result = store.getNextCount();
//
//     expect(result).toBe(1);
//   });
//
//   it('can call another getter via raw API (no type check)', () => {
//
//     const state = { count: 0 };
//
//     class TestStore extends TypedStore<typeof state> {
//       getCurrentCount = this.g('GET_CURRENT_COUNT', s => s.count);
//       getNextCount    = this.g('GET_NEXT_COUNT', (s, g) => g['GET_CURRENT_COUNT'] + 1);
//
//       constructor(options: ITypedStoreOptions<typeof state>) {
//         super(options);
//         this.$bootstrap();
//       }
//     }
//
//     const store = new TestStore({ state });
//
//     const result = store.getNextCount();
//
//     expect(result).toBe(1);
//   });
// });
