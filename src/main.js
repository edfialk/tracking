import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles.scss';

import Vue from 'vue';
import App from './App.vue';
import router from './router';

import VueApexCharts from 'vue-apexcharts';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebase.config';


Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

Vue.use(Datetime);
Vue.component('datetime', Datetime);

Vue.filter('date', value => {
  return new Date(value).toLocaleDateString()
});

Vue.config.productionTip = false;

firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
