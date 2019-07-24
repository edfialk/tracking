import Vue from 'vue';

const state = {
    all: {}
};

const getters = {
    get: state => {
        return state.all;
    },
    tracker: (state) => (tracker) => {
        return state.all ? state.all[tracker] : null;
    },
    since: (state) => (date) => {
        let res = {};
        for (let t in state.all) {
            res[t] = state.all[t].filter(r => r.date > date);
        }
        return res;
    },
    maxCountSince: (state, getters) => (date) => {
        let count = 0;
        let since = getters.since(date);
        for (let t in since){
            count = Math.max(count, since[t].length);
        }
        return count;
    },
};

const actions = {
    get ({ commit, rootState }) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = rootState.db.collection('ratings').doc(rootState.user.uid);
                let resp = await query.get();
                let all = resp.data();
                for (let tracker in all) {
                    all[tracker] = all[tracker].map(rating => {
                        if (rating.date && rating.date.toDate){
                            rating.date = rating.date.toDate()
                        }
                        return rating;
                    });
                }
                commit('set', all);
                resolve(all);
            } catch (e) {
                commit('error', e, { root: true });
                reject(e);
            }
        });
    },

    add ({ commit, state, rootState }, rating) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!rating.tracker) {
                    commit('error', 'Invalid rating.', { root: true });
                    reject('Invalid rating.');
                }

                if (!rating.date) {
                    rating.date = new Date();
                }

                // let trackerRef = await rootState.db.collection(rating.tracker);
                // if (!trackerRef) {
                //     commit('error', 'Tracker not found.', { root: true });
                //     reject('Tracker not found.');
                // }

                let ratings = [];
                if (state.all[rating.tracker])
                    ratings = state.all[rating.tracker].slice();

                ratings.push({
                    date: rating.date,
                    value: rating.value
                });

                let update = {};
                update[rating.tracker] = ratings;

                await rootState.db.collection('ratings').doc(rootState.user.uid).update(update);

                commit('add', rating);
                resolve(update);
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

    // update(state, payload) {
    //     state.all[payload]
    // },

    add(state, payload) {
        state.all[payload.tracker] = state.all[payload.tracker] || [];
        state.all[payload.tracker].push({ date: payload.date, value: payload.value });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};