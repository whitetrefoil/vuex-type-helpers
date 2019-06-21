import { mount }                  from '@vue/test-utils';
import Vue                        from 'vue';
import { default as Vuex, Store } from 'vuex';
import TypedModule                from '../src/main';

jest.resetModules();

Vue.use(Vuex);

describe('mutation()', () => {
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
    expect(itShouldWork.fullKey).toBe('ut/IT_SHOULD_WORK');
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
    expect(itShouldWork.fullKey).toBe('ut/IT_SHOULD_WORK');
  });
});

describe('action()', () => {
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
    expect(utAction.fullKey).toBe('ut/UT_ACTION');
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
    expect(utAction.fullKey).toBe('ut/UT_ACTION');
  });
});

describe('getter()', () => {
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
    const mutateIt     = module.mutation<void>('MUTATE_IT', s => s.count += 100);

    module.finish();

    const wrapper = mount({
      template: '<div>{{output}}</div>',
      computed: {
        output() { return itShouldWork(); },
      },
    });

    expect(wrapper.html()).toBe('<div>100</div>');
    expect(wrapper.html()).toBe('<div>100</div>');
    mutateIt();
    expect(wrapper.html()).toBe('<div>200</div>');
    expect(wrapper.html()).toBe('<div>200</div>');
    expect(itShouldWork.key).toBe('IT_SHOULD_WORK');
    expect(itShouldWork.fullKey).toBe('ut/IT_SHOULD_WORK');
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
    const mutateIt     = module.mutation<void>('MUTATE_IT', s => s.count += 100);

    module.finish();

    const wrapper = mount({
      template: '<div>{{output100}}|{{output200}}</div>',
      computed: {
        output100() { return itShouldWork()(100); },
        output200() { return itShouldWork()(200); },
      },
    });

    expect(wrapper.html()).toBe('<div>100|200</div>');
    expect(wrapper.html()).toBe('<div>100|200</div>');
    mutateIt();
    expect(wrapper.html()).toBe('<div>200|300</div>');
    expect(wrapper.html()).toBe('<div>200|300</div>');
    expect(itShouldWork.key).toBe('IT_SHOULD_WORK');
    expect(itShouldWork.fullKey).toBe('ut/IT_SHOULD_WORK');
  });
});

describe('mGetter()', () => {
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

    const itShouldWork = module.mGetter<number, number>('IT_SHOULD_WORK', s => add => s.count + add);
    const mutateIt     = module.mutation<void>('MUTATE_IT', s => s.count += 100);

    module.finish();

    const wrapper = mount({
      template: '<div>{{output100}}|{{output200}}</div>',
      computed: {
        output100() { return itShouldWork(100); },
        output200() { return itShouldWork(200); },
      },
    });

    expect(wrapper.html()).toBe('<div>100|200</div>');
    expect(wrapper.html()).toBe('<div>100|200</div>');
    mutateIt();
    expect(wrapper.html()).toBe('<div>200|300</div>');
    expect(wrapper.html()).toBe('<div>200|300</div>');
    expect(itShouldWork.key).toBe('IT_SHOULD_WORK');
    expect(itShouldWork.fullKey).toBe('ut/IT_SHOULD_WORK');
  });
});

describe('if use state directly?', () => {
  it('should work or not?', () => {
    interface S {
      count: number;
    }

    interface R {
      ut: S;
    }

    const state: S = { count: 100 };
    const store    = new Store<R>({});

    const module   = new TypedModule(store, 'ut', state);
    const mutateIt = module.mutation<void>('MUTATE_IT', s => s.count += 100);
    module.finish();

    const wrapper = mount({
      template: '<div>{{computed}}|{{method()}}</div>',
      computed: {
        computed() { return state.count; },
      },
      methods : {
        method() { return state.count; },
      },
    });

    expect(wrapper.html()).toBe('<div>100|100</div>');
    expect(wrapper.html()).toBe('<div>100|100</div>');
    mutateIt();
    expect(wrapper.html()).toBe('<div>200|200</div>');
    expect(wrapper.html()).toBe('<div>200|200</div>');
  });
});
