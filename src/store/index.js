import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from '../firebase.config';

import things from './modules/things';
import trackers from './modules/trackers';
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
    error(state, payload) {
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
      commit('setStatus', 'success');
      commit('error', null);
    },

    // async getTrackers ({ commit, state }) {
    //   try {

    //     let ref = state.db.collection('trackers').where('user_id', '==', 1);
    //     let resp = await ref.get();
    //     let trackers = resp.docs.map(t => t.id);

    //     commit('setTrackers', trackers);

    //   } catch(e) {
    //     console.log('error', e);
    //     commit('error', e);
    //   }

    // },

  },

  getters: {
    status (state) {
      return state.status
    },

    user (state) {
      return state.user
    },

    error (state) {
      return state.error
    },
    
    isLoggedIn: state => {
      return state.user !== null;
    }

  }
})
