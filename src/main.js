import 'bootstrap';
import '@/styles.scss';

import Vue from 'vue';
import store from './store/index.js'
import App from './App.vue';
import router from './router';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';

import 'd3';
import 'c3/c3.min.css';

Vue.use(Datetime);
Vue.component('datetime', Datetime);

Vue.filter('date', value => {
  if (!value) return '';
  
  if (value.toLocaleDateString) 
    return value.toLocaleDateString();

  let date = value.toDate ? value.toDate() : new Date(value);
  return date.toLocaleDateString()
});

Vue.config.productionTip = false;

firebase.auth().onAuthStateChanged(user => {
  store.commit('setUser', user);
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
});

