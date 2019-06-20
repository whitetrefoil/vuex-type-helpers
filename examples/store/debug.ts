import TypedModule          from '../../src/main';
import { FullState, store } from './index';

// Any container (object, class, even the file itself) is OK.
export namespace DebugStore {
  export interface State {
    count: number;
    message: string;
  }

  const state: State = {
    count  : 0,
    message: 'initialized',
  };

  const m = new TypedModule<State, FullState>(store, 'debug', state);

  // Normal getter
  export const getMessage = m.getter<string>('GET_MESSAGE', s => s.message);

  // Method style getter
  export const getNextCount = m.getter<(step: number) => number>(
    'GET_NEXT_COUNT',
    s => step => s.count + step,
  );

  // Shorter method style getter - one less `()`.
  export const getInitialLetters = m.mGetter<string, number>(
    'GET_INITIAL_LETTERS',
    s => letters => s.message.substr(0, letters),
  );

  // Mutation with no arg.
  export const countOne = m.mutation<void>('COUNT_ONE', s => s.count += 1);

  // Mutation with object arg.
  export const setMessage = m.mutation<{ msg: string }>(
    'SET_MESSAGE',
    (s, { data }) => s.message = data.msg,
  );

  // Action, arg can also be `void` just like mutations.
  export const countAfterSeconds = m.action<number>(
    'COUNT_AFTER_SECONDS',
    async(ctx, { data }) => {
      return new Promise(resolve => {
        setTimeout(() => {
          countOne();
        }, data);
      });
    },
  );

  // `.finish()` must be called at the end.
  m.finish();
}
