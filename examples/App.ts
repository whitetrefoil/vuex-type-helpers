import { Component, Lifecycle, Vue } from 'av-ts';
import { mapGetters, mapMutations }  from 'vuex';
// Will register module here.
import { DebugStore }                from './store/debug';


@Component({
  computed: {
    ...mapGetters({
      // If you are used to vuex's standard mapXxx way...
      message: DebugStore.getMessage.fullKey,
    }),
  },
  methods : {
    ...mapMutations({
      count: DebugStore.countOne.fullKey,
    }),
  },
})
export default class App extends Vue {
  // If you are used to vuex's standard mapXxx way...
  readonly message!: ReturnType<typeof DebugStore.getMessage>;
  readonly count!: () => void;

  get nextCount(): number {
    // Method style getters w/o `mGetter` shortcut need two `()`.
    return DebugStore.getNextCount()(1);
  }

  get initialFourLetters(): string {
    // Method style getters w/ `mGetter` are shorter.
    return DebugStore.getInitialLetters(4);
  }

  get useStateDirectly(): string {
    // The state object is actually reactive,
    // can be used directly.
    // But be sure **NOT** to modify it!!!
    return DebugStore.state.message;
  }

  @Lifecycle
  async mounted() {
    await DebugStore.countAfterSeconds(1000);
    DebugStore.setMessage({ msg: 'counted' });
  }
}
