import { ActionContext, ActionTree, GetterTree, MutationTree, Store } from 'vuex'
import { addAction, addGetter, addMutation }                          from '../src/main'

jest.resetModules()

describe('addMutations', () => {
  it('should work', () => {

    const state = { count: 0 }

    const mutations: MutationTree<{ count: number }> = {}

    const itShouldWork = addMutation(
      mutations,
      'IT_SHOULD_WORK',
      (state, num: number) => {
        state.count = num
      },
    )

    const payload = itShouldWork(222)

    expect(payload).toEqual({
      type: 'IT_SHOULD_WORK',
      data: 222,
    })

    mutations['IT_SHOULD_WORK'](state, payload)

    expect(state.count).toBe(222)
  })
})

describe('addActions', () => {
  it('should work', () => {

    let _n = 0

    const context: ActionContext<{}, {}> = {} as any

    const actions: ActionTree<{}, {}> = {}

    const itShouldWork = addAction(
      actions,
      'IT_SHOULD_WORK',
      async(context, num: number) => {
        _n = num
      },
    )

    const payload = itShouldWork(222222)

    expect(payload).toEqual({
      type: 'IT_SHOULD_WORK',
      data: 222222,
    });

    (actions as any)['IT_SHOULD_WORK'](context, payload)

    expect(_n).toBe(222222)
  })
})

describe('addGetters', () => {
  it('should work', () => {

    const state = { count: 0 }

    const getters: GetterTree<typeof state, typeof state> = {}

    const itShouldWork = addGetter(getters, 'IT_SHOULD_WORK', state => state.count)

    const store = {
      getters: {
        'IT_SHOULD_WORK': () => getters['IT_SHOULD_WORK'](state, {}, state, {}),
      },
    } as any as Store<typeof state>

    const result = itShouldWork(store)

    expect(result).toBe(0)
  })

  it('should work as function pattern', () => {

    const state = { count: 0 }

    const getters: GetterTree<typeof state, typeof state> = {}

    const getNextCount = addGetter(getters, 'GET_NEXT_COUNT', state => (step: number) => state.count + step)

    const store = {
      getters: {
        'GET_NEXT_COUNT': () => getters['GET_NEXT_COUNT'](state, {}, state, {}),
      },
    } as any as Store<typeof state>

    const result = getNextCount(store)(10)

    expect(result).toBe(10)
  })
})
