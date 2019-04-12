import Vue                                      from 'vue';
import { default as Vuex }                      from 'vuex';
import { Store, TypedStore, TypedStoreOptions } from '../src';


jest.resetModules();


beforeAll(() => {
  Vue.use(Vuex);
});


describe('TypedStore', () => {
  it('should work', () => {

    @Store(Vue)
    class TestStore extends TypedStore<{}, {}> {
      constructor(options: TypedStoreOptions<{}>) {
        super(options);
      }
    }

    const store = new TestStore({
      state: {},
    });

    expect(store instanceof TypedStore).toBeTruthy();
  });
});


describe('addMutations', () => {
  it('should work', () => {

    const state = { count: 0 };

    @Store(Vue)
    class TestStore extends TypedStore<typeof state, typeof state> {
      itShouldWork = this.m('IT_SHOULD_WORK', (s, num: number) => {
        s.count = num;
      });

      constructor(options: TypedStoreOptions<typeof state>) {
        super(options);
      }
    }

    const store = new TestStore({ state });

    store.itShouldWork(222);

    expect(store.state.count).toEqual(222);
  });
});


describe('addActions', () => {
  it('should work', async() => {

    const state = { count: 0 };

    @Store(Vue)
    class TestStore extends TypedStore<typeof state, typeof state> {
      iAmAMutation = this.m('I_AM_A_MUTATION', (s, num: number) => {
        s.count = num;
      });

      itShouldWork = this.a('IT_SHOULD_WORK', async(s, num: number) => {
        this.iAmAMutation(num);
        return '???';
      });

      constructor(options: TypedStoreOptions<typeof state>) {
        super(options);
      }
    }

    const store = new TestStore({ state });

    const returnValue = await store.itShouldWork(222);

    expect(store.state.count).toEqual(222);
    expect(returnValue).toEqual('???');
  });
});


describe('addGetters', () => {
  it('should work', () => {

    const state = { count: 0 };

    @Store(Vue)
    class TestStore extends TypedStore<typeof state, typeof state> {
      itShouldWork = this.g('IT_SHOULD_WORK', s => s.count);

      constructor(options: TypedStoreOptions<typeof state>) {
        super(options);
      }
    }

    const store = new TestStore({ state });

    const result = store.itShouldWork();

    expect(result).toBe(0);
  });

  it('should work as function pattern', () => {

    const state = { count: 0 };

    @Store(Vue)
    class TestStore extends TypedStore<typeof state, typeof state> {
      itShouldWork = this.g('GET_NEXT_COUNT', s => (step: number) => s.count + step);

      constructor(options: TypedStoreOptions<typeof state>) {
        super(options);
      }
    }

    const store = new TestStore({ state });

    const result = store.itShouldWork()(10);

    expect(result).toBe(10);
  });

  it('can call another getter', () => {

    const state = { count: 0 };

    @Store(Vue)
    class TestStore extends TypedStore<typeof state, typeof state> {
      getCurrentCount = this.g('GET_CURRENT_COUNT', s => s.count);
      getNextCount    = this.g('GET_NEXT_COUNT', s => this.getCurrentCount() + 1);

      constructor(options: TypedStoreOptions<typeof state>) {
        super(options);
      }
    }

    const store = new TestStore({ state });

    const result = store.getNextCount();

    expect(result).toBe(1);
  });

  it('can call another getter via raw API (no type check)', () => {

    const state = { count: 0 };

    @Store(Vue)
    class TestStore extends TypedStore<typeof state, typeof state> {
      getCurrentCount = this.g('GET_CURRENT_COUNT', s => s.count);
      getNextCount    = this.g('GET_NEXT_COUNT', (s, g) => g['GET_CURRENT_COUNT'] + 1);

      constructor(options: TypedStoreOptions<typeof state>) {
        super(options);
      }
    }

    const store = new TestStore({ state });

    const result = store.getNextCount();

    expect(result).toBe(1);
  });
});
