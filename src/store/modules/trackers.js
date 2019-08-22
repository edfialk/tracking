import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/firestore';

const state = {
    all: [],
    status: '',
    error: ''
};

const getters = {
    named: (state) => (name) => {
        return state.all.find(tracker => tracker.name === name);
    },
    get: state => {
        return state.all;
    },
};

const actions = {
    delete({ commit, rootState}, name ) {
        return new Promise(async (resolve, reject) => {
            try {

                if (typeof name !== 'string'){
                    commit('error', "Tracker should be string.");
                    reject("Tracker should be string.");
                    return;
                }

                commit('status', 'loading');

                let trackers = state.all.filter(t => t !== name);

                await firebase.firestore().collection('users').doc(rootState.user.uid).update({
                    trackers: firebase.firestore.FieldValue.arrayRemove(name)
                });

                let update = {};
                update[name] = firebase.firestore.FieldValue.delete();

                await firebase.firestore().collection('ratings').doc(rootState.user.uid).update(update);

                commit('set', trackers);
                commit('status', 'success');

            } catch (e) {
                commit('error', e);
                reject(e);
            }
        })
    }
};

const mutations = {
    set(state, payload) {
        Vue.set(state, 'all', payload);
    },

    add(state, payload) {
        state.all = [...state.all, payload];
    },

    status(state, payload) {
        state.status = payload;
    },
    error(state, payload) {
        state.error = payload;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};