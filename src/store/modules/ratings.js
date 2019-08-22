import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/firestore';

const state = {
    all: {},
    status: '',
    error: ''
};

const getters = {
    get: state => {
        return state.all;
    },
    tracker: (state) => (tracker) => {
        return state.all ? state.all[tracker] : null;
    },
    trackers: (state) => {
        return Object.keys(state.all);
    },
    hasRatings: (state) => {
        return Object.keys(state.all).length > 0;
    }
};

const actions = {
    get ({ commit, rootState }) {
        return new Promise(async (resolve, reject) => {
            try {

                commit('status', 'loading');
                commit('error', null);

                let query = firebase.firestore().collection('ratings').doc(rootState.user.uid);
                let resp = await query.get();
                let all = {};
                if (resp.exists) {
                    all = resp.data();
                    for (let tracker in all) {
                        all[tracker] = all[tracker].map(rating => {
                            if (rating.date && rating.date.toDate){
                                rating.date = rating.date.toDate()
                            }
                            return rating;
                        });
                    }
                }

                commit('set', all);
                commit('status', 'success');
                
                resolve(all);
            } catch (e) {
                commit('error', e);
                reject(e);
            }
        });
    },

    add ({ commit, state, rootState }, rating) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!rating.tracker) {
                    commit('error', 'Invalid rating.');
                    reject('Invalid rating.');
                }

                if (!rating.date) {
                    rating.date = new Date();
                }

                let ratings = [];
                if (state.all[rating.tracker])
                    ratings = state.all[rating.tracker].slice();

                ratings.push({
                    date: rating.date,
                    value: rating.value
                });

                let update = {};
                update[rating.tracker] = ratings;

                await firebase.firestore().collection('ratings').doc(rootState.user.uid).update(update);

                commit('add', rating);
                resolve(update);
            } catch (e) {
                commit('error', e);
                reject(e);
            }
        });
    },

    deleteTracker({ commit, state, rootState }, tracker) {
        return new Promise(async (resolve, reject) => {
            try {
                if (typeof name !== 'string'){
                    commit('error', "Tracker should be string.");
                    reject("Tracker should be string.");
                    return;
                }

                let update = {};
                update[tracker] = firebase.firestore.FieldValue.delete();          
                
                await firebase.firestore().collection('ratings').doc(rootState.user.uid).update(update);

                commit('deleteTracker', tracker);
                commit('status', 'loading');
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
        state.all[payload.tracker] = state.all[payload.tracker] || [];
        state.all[payload.tracker].push({ date: payload.date, value: payload.value });
    },

    deleteTracker(state, payload) {
        Vue.delete(state.all, payload);
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