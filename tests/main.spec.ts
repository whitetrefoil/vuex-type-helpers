import Vue                        from 'vue';
import { default as Vuex, Store } from 'vuex';
import TypedModule                from '../src/main';

jest.resetModules();

Vue.use(Vuex);

describe('addMutations', () => {
  it('should work', () => {
    interface S {
      count: number;
    }

    interface R {
      ut: S;
    }

    const state: S = { count: 0 };
    const store    = new Store<R>({});

    const module = new TypedModule(store, 'ut', state);

    const itShouldWork = module.mutation<number>('IT_SHOULD_WORK', (s, p) => { s.count = p.data; });

    module.finish();

    itShouldWork(222);

    expect(store.state.ut.count).toBe(222);
    expect(itShouldWork.key).toBe('IT_SHOULD_WORK');
  });

  it('should allow empty mutations', () => {
    interface S {
      count: number;
    }

    interface R {
      ut: S;
    }

    const state: S = { count: 0 };
    const store    = new Store<R>({});

    const module = new TypedModule(store, 'ut', state);

    const itShouldWork = module.mutation<void>('IT_SHOULD_WORK', s => { s.count += 1; });

    module.finish();

    itShouldWork();

    expect(store.state.ut.count).toBe(1);
    expect(itShouldWork.key).toBe('IT_SHOULD_WORK');
  });
});

describe('addActions', () => {
  it('should work', async() => {
    interface S {
      count: number;
    }

    interface R {
      ut: S;
    }

    const state: S = { count: 0 };
    const store    = new Store<R>({});

    const module     = new TypedModule(store, 'ut', state);
    const utMutation = module.mutation<number>('UT_MUTATION', (s, p) => { s.count += p.data; });
    const utAction   = module.action<number>('UT_ACTION', async(s, p) => {
      utMutation(p.data);
    });

    module.finish();

    await utAction(333);

    expect(store.state.ut.count).toBe(333);
    expect(utAction.key).toBe('UT_ACTION');
  });

  it('should allow empty actions', async() => {
    interface S {
      count: number;
    }

    interface R {
      ut: S;
    }

    const state: S = { count: 0 };
    const store    = new Store<R>({});

    const module     = new TypedModule(store, 'ut', state);
    const utMutation = module.mutation<void>('UT_MUTATION', s => { s.count += 1; });
    const utAction   = module.action<void>('UT_ACTION', async s => {
      utMutation();
    });

    module.finish();

    await utAction();

    expect(store.state.ut.count).toBe(1);
    expect(utAction.key).toBe('UT_ACTION');
  });
});

describe('addGetters', () => {
  it('should work', () => {
    interface S {
      count: number;
    }

    interface R {
      ut: S;
    }

    const state: S = { count: 0 };
    const store    = new Store<R>({});

    const module = new TypedModule(store, 'ut', state);

    const itShouldWork = module.getter<number>('IT_SHOULD_WORK', s => s.count + 100);

    module.finish();

    expect(itShouldWork()).toBe(100);
    expect(itShouldWork()).toBe(100);
    expect(itShouldWork()).toBe(100);
    expect(itShouldWork.key).toBe('IT_SHOULD_WORK');
  });

  it('should work as a function', () => {
    interface S {
      count: number;
    }

    interface R {
      ut: S;
    }

    const state: S = { count: 0 };
    const store    = new Store<R>({});

    const module = new TypedModule(store, 'ut', state);

    const itShouldWork = module.getter<(add: number) => number>('IT_SHOULD_WORK', s => add => s.count + add);

    module.finish();

    expect(itShouldWork()(100)).toBe(100);
    expect(itShouldWork()(200)).toBe(200);
    expect(itShouldWork()(100)).toBe(100);
    expect(itShouldWork.key).toBe('IT_SHOULD_WORK');
  });
});
