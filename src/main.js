import 'bootstrap';
import 'vue-datetime/dist/vue-datetime.css';
import '@/styles.scss';

import Vue from 'vue';
import store from './store/index.js'
import App from './App.vue';
import router from './router';
import './registerServiceWorker'

import * as firebase from 'firebase/app';
import 'firebase/auth';

import { Datetime } from 'vue-datetime';
import 'd3';
import 'c3/c3.min.css';
import moment from 'moment';

// import 'lib/nanogallery/jquery.nanogallery2.core.min';

Vue.use(Datetime);
Vue.component('datetime', Datetime);

Vue.filter('date', value => {
  if (!value) return '';

  if (value.toLocaleDateString) 
    return value.toLocaleDateString();

  let date = value.toDate ? value.toDate() : new Date(value);
  return date.toLocaleDateString()
});

Vue.filter('ago', (value, suffix) => {
  return moment(value).fromNow(suffix);
});

Vue.config.productionTip = false;

const unsubscribe = firebase.auth().onAuthStateChanged(user => {

  if (user) {
    store.commit('setUser', user.toJSON() );
  }

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')

  unsubscribe();

});

