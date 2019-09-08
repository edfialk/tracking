import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from '../firebase.config';

import things from './modules/things';
import trackers from './modules/trackers';
import ratings from './modules/ratings';
import photos from './modules/photos';


firebase.initializeApp(firebaseConfig);
Vue.prototype.$firebase = firebase.firestore();

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  user: null,
  trackers: [],
  factors: [],
  status: '',
  error: ''
};

export default new Vuex.Store({
  strict: debug,
  modules: {
    things,
    ratings,
    trackers,
    photos
  },
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
    status(state, payload) {
      state.status = payload;
    },
    error(state, payload) {
      // if (payload) console.log('error', payload);
      state.error = payload;
    },
    trackers(state, payload) {
      state.trackers = payload;
    },
    factors(state, payload) {
      state.factors = payload;
    }


  },
  actions: {
    login ({ dispatch, commit }, { email, password }) {
      return new Promise(async (resolve, reject) => {
        commit('status', 'loading');
  
        try {

          let resp = await firebase.auth().signInWithEmailAndPassword(email, password);
          
          commit('setUser', resp.user.toJSON());
          commit('status', 'success');
          commit('error', null);
          
          dispatch('things/get');
          dispatch('ratings/get');

          resolve(resp.user);

        } catch (e) {

          commit('setUser', false);
          commit('status', 'error');
          commit('error', e);

          reject(e);

        }
  
      });
    },

    async logout ({ commit }) {
      commit('status', 'loading');

      await firebase.auth().signOut();

      commit('setUser', null);
      commit('status', 'success');
      commit('error', null);
    },

    get ({ commit, state }) {
      return new Promise(async (resolve, reject) => {
        commit('status', 'loading');

        try {

          const doc = await firebase.firestore().collection('users').doc(state.user.uid);
          const resp = await doc.get();
          let data = {};
          if (resp.exists) {
            data = resp.data();
            commit('trackers', data.trackers);
            commit('factors', data.factors);
          }

          commit('status', 'success');
          resolve(data);
        } catch (e) {
          commit('error', e);
          reject(e);
        }
      });
    },

  },

  getters: {
    isLoggedIn: state => {
      return state.user !== null;
    }

  }
})
