import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);
Vue.use(Vuex)
// Vue.prototype.$firebase = firebase;

const state = {
  user: null,
  trackers: [],
  db: firebase.firestore()
};

export default new Vuex.Store({
  state,
  mutations: {
    setUser (state, payload) {
      state.user = payload;
    },
    setStatus(state, payload) {
      state.status = payload;
    }
  },
  actions: {
    async signIn ({ commit, state }, payload) {
      await state.db.auth().signInWithEmailAndPassword(payload.email, payload.password);

      commit('setUser', state.db.auth().currentUser);
    }
  }
})
