import Vue from 'vue';

const state = {
    all: []
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
    get ({ commit, rootState }) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = rootState.db.collection('trackers');
                let resp = await query.get();
                let all = resp.docs.map(doc => {
                    return {
                        id: doc.id,
                        ...doc.data()
                    };
                });
                commit('set', all);
                resolve(all);
            } catch (e) {
                commit('error', e, { root: true });
                reject(e);
            }
        });
    },

    add ({ commit, rootState }, tracker) {
        return new Promise(async (resolve, reject) => {
            try {

                if (typeof tracker !== 'string'){
                    commit('error', "Tracker should be string.", { root: true });
                    reject("Tracker should be string.");
                }

                let trackers = state.all.slice() || [];
                trackers.push(tracker);

                let update = {};
                update['trackers'] = trackers;

                await rootState.db.collection('users').doc(rootState.user.uid).update(update);

                commit('add', tracker);
                resolve(tracker);
            } catch (e) {
                commit('error', e, { root: true });
                reject(e);
            }
        });
    }
};

const mutations = {
    set(state, payload) {
        Vue.set(state, 'all', payload);
    },

    add(state, payload) {
        state.all = [...state.all, payload];
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};