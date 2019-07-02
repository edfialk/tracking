const state = {
    all: []
};

const getters = {
    getByTracker: (state) => (tracker) => {
        return state.all.filter(rating => rating.tracker === tracker);
    },
    get: state => {
        return state.all.reduce((acc, cur) => {
            if (cur.tracker){
                acc[cur.tracker] = acc[cur.tracker] || [];
                acc[cur.tracker].push(cur);
            }
            return acc;
        }, {});
    },
    getTrackers: state => {
        let trackers = new Set();
        state.all.forEach(rating => {
            trackers.add(rating.tracker);
        });
        return Array.from(trackers);
    }
};

const actions = {
    get ({ commit, rootState }) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = rootState.db.collection('ratings');
                let resp = await query.get();
                let all = resp.docs.map(doc => {
                    return {
                        ...doc.data(),
                        date: new Date(doc.data().date.toMillis())
                    };
                });
                commit('set', all);
                resolve(all);
            } catch (e) {
                commit('setError', e, { root: true });
                console.log(e);
                reject(e);
            }
        });
    },

    add ({ commit, rootState }, rating) {
        return new Promise(async (resolve, reject) => {
            try {
                if (rating.rating > 10) {
                    rating.rating = Math.round(rating.rating / 10);
                }
                rating.date = new Date();
                await rootState.db.collection('ratings').add(rating);
                commit('add', rating);
                resolve(rating);
            } catch (e) {
                commit('setError', e, { root: true });
                console.log(e);
                reject(e);
            }
        });
    }
};

const mutations = {
    set(state, payload) {
        state.all = payload;
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