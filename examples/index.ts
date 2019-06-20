import { Vue }   from 'av-ts';
import App       from './App';
import { store } from './store';

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
