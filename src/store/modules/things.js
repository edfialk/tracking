import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/firestore';

const state = {
    all: {},
    status: '',
    error: ''
};

const getters = {
    active: state => {
        let resp = [];
        for (let thing in state.all) {
            if (state.all[thing].since) resp.push(state.all[thing]);
        }
        return resp;
    },

    inactive: state => {
        let resp = [];
        for (let thing in state.all) {
            if (!state.all[thing].since) resp.push(state.all[thing]);
        }
        return resp;
    },

    name: (state) => (name) => {
        return state.all ? state.all[name] : null;
    }
};

const actions = {
    get ({ commit, rootState }) {
        return new Promise(async (resolve, reject) => {
            try {

                commit('status', 'loading');
                commit('error', null);

                let all = {};
                let doc = firebase.firestore().collection('factors').doc(rootState.user.uid);
                let resp = doc.get();

                if (!resp.exists) {

                    await doc.set({});

                } else {

                    all = resp.data();
                    //convert firebase timestamps to date
                    for (let thing in all) {
                        if (all[thing].dates && all[thing].dates.length > 0){
                            all[thing].dates = all[thing].dates.map(range => {
                                for (let time in range){
                                    if (range[time].toDate){
                                        range[time] = range[time].toDate();
                                    }
                                }
                                return range;
                            });
                        }
                        if (all[thing].since && all[thing].since.toDate) {
                            all[thing].since = all[thing].since.toDate();
                        }
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

    add ({ commit, rootState }, thing) {
        return new Promise(async (resolve, reject) => {
            try {
                commit('update', thing);
                let update = {};
                update[thing.name] = thing;
                await firebase.firestore().collection('factors').doc(rootState.user.uid).update(update);
                resolve(thing);
            } catch (e) {
                commit('error', e);
                reject(e);
            }
        });
    },

    save ({ commit, rootState }, thing) {
        return new Promise(async (resolve, reject) => {
            try {
                let update = {};
                update[thing.name] = thing;
                await firebase.firestore().collection('factors').doc(rootState.user.uid).update(update);
                commit('update', thing);
                resolve(thing);
            } catch (e) {
                commit('error', e);
                reject(e);
            }
        });
    },

    delete ({ commit, rootState}, thing) {
        return new Promise(async (resolve, reject) => {
            try {
                let update = {};
                update[thing.name] = firebase.firestore.FieldValue.delete();
                await firebase.firestore().collection('factors').doc(rootState.user.uid).update(update);
                commit('delete', thing);
                resolve();
            } catch (e) {
                commit('error', e);
                reject(e);
            }
        });
    },
};

const mutations = {
    set(state, payload) {
        Vue.set(state, 'all', payload);
    },

    add(state, thing) {
        state.all[thing.name] = thing;
    },

    update(state, thing) {
        state.all[thing.name] = thing;
    },

    delete(state, payload) {
        Vue.delete(state.all, payload.name);
    },
    
    status(state, payload) {
        state.status = payload;
    },

    error(state, payload) {
        state.error = payload;
    },

    setDate(state, { name, dates }) {
        state.all[name].dates = dates;
    },

    setName(state, { thing, name }) {
        Vue.delete(state.all, thing.name);
        Vue.set(state.all, name, thing);
        // state.all[name] = thing;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};