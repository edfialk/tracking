import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles.scss';

import Vue from 'vue';
import store from './store'
import App from './App.vue';
import router from './router';

import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';

import 'd3';
import 'c3/c3.min.css';

Vue.use(Datetime);
Vue.component('datetime', Datetime);

Vue.filter('date', value => {
  return new Date(value).toLocaleDateString()
});

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  //auth
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
