const state = {
    all: []
};

const getters = {
    named: (state) => (name) => {
        return state.all.filter(tracker => tracker.name === name);
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
                console.log(e);
                reject(e);
            }
        });
    },

    add ({ commit, rootState }, tracker) {
        return new Promise(async (resolve, reject) => {
            try {
                let ref = await rootState.db.collection('trackers').add(tracker);
                tracker.id = ref.id;
                commit('add', tracker);
                resolve(tracker);
            } catch (e) {
                commit('error', e, { root: true });
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