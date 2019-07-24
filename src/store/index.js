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

// const debug = process.env.NODE_ENV !== 'production'

const state = {
  user: null,
  db: firebase.firestore(),
  trackers: [],
  things: [],
  status: null,
  error: null
};

export default new Vuex.Store({
  modules: {
    things,
    ratings,
    trackers
  },
  // strict: debug,
  state,
  mutations: {
    setUser (state, payload) {
      state.user = payload;
    },
    setTrackers(state, payload) {
      state.trackers = payload;
    },
    addTracker(state, payload) {
      state.trackers.push(payload);
    },
    setRatings(state, payload) {
      state.ratings = payload;
    },
    setThings(state, payload) {
      state.things = payload;
    },
    setStatus(state, payload) {
      state.status = payload;
    },
    error(state, payload) {
      if (payload) console.log('error', payload);
      state.error = payload;
    },

  },
  actions: {
    async signIn ({ commit, state }, { email, password }) {
      await state.db.auth().signInWithEmailAndPassword(email, password);

      commit('setUser', state.db.auth().currentUser);
      commit('setStatus', 'success');
      commit('error', null);
    },

    async getUserData ({ commit, state }) {
      let query = await state.db.collection('users').doc(state.user.uid).get();
      let data = query.data();

      commit('setTrackers', data.trackers);
      commit('setThings', data.factors);
      commit('setStatus', 'success');
      commit('error', null);
     
    },

    addTracker ({ commit, state }, tracker) {
      return new Promise(async (resolve, reject) => {
          try {

              if (typeof tracker !== 'string'){
                  commit('error', "Tracker should be string.");
                  reject("Tracker should be string.");
              }

              let trackers = state.trackers.slice() || [];
              trackers.push(tracker);

              await state.db.collection('users').doc(state.user.uid).update({ trackers });

              commit('addTracker', tracker);
              resolve(tracker);
          } catch (e) {
              commit('error', e, );
              reject(e);
          }
      });
  }

  },

  getters: {
    isLoggedIn: state => {
      return state.user !== null;
    }

  }
})
