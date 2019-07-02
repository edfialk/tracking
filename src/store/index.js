import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from '../firebase.config';

import things from './modules/things';
import ratings from './modules/ratings';

firebase.initializeApp(firebaseConfig);
Vue.use(Vuex)
// Vue.prototype.$firebase = firebase;

const debug = process.env.NODE_ENV !== 'production'

const state = {
  user: null,
  db: firebase.firestore(),
  trackers: [],
  ratings: [],
  status: null,
  error: null
};

export default new Vuex.Store({
  modules: {
    things,
    ratings
  },
  // strict: debug,
  state,
  mutations: {
    setUser (state, payload) {
      state.user = payload;
    },
    setStatus(state, payload) {
      state.status = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setTrackers(state, payload) {
      state.trackers = payload;
    },
    setRatings(state, payload) {
      state.ratings = payload;
    },

  },
  actions: {
    async signIn ({ commit, state }, { email, password }) {
      await state.db.auth().signInWithEmailAndPassword(email, password);

      commit('setUser', state.db.auth().currentUser);
    },

    async getTrackers ({ commit, state }) {
      try {

        let ref = state.db.collection('trackers').where('user_id', '==', 1);
        let resp = await ref.get();
        let trackers = resp.docs.map(t => t.id);

        commit('setTrackers', trackers);

      } catch(e) {
        console.log('error', e);
        commit('setError', e);
      }

    },

    // async getRatings ({ commit, state }) {
    //   try {

    //     let query = state.db.collection('ratings');
    //     // .where('user_id', '==', 1);
    //     let resp = await query.get();
    //     let ratings = resp.docs.map(doc => {
    //       return {
    //         ...doc.data(),
    //         date: new Date(doc.data().date.toMillis())
    //       };
    //     });

    //     commit('setRatings', ratings);

    //   } catch (e) {
    //     commit('setError', e);
    //     console.log(e);
    //   }
    // },



  },

  getters: {


  }
})
