const state = {
    all: []
};

const getters = {
    active: state => {
        return state.all.filter(thing => thing.active);
    },

    inactive: state => {
        return state.all.filter(thing => !thing.active);
    },

    getById: (state) => (id) => {
        return state.all.find(t => t.id === id);
    },

    getByName: (state) => (name) => {
        return state.all.find(t => t.name === name);
    }
};

const actions = {
    async get ({ commit, rootState }) {
        try {

            let query = rootState.db.collection('factors');
            let resp = await query.get();
            let things = resp.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });

            commit('set_all', things);

        } catch (e) {
            commit('setError', e, { root: true });
            console.log(e);
        }
    },

    add ({ commit, rootState }, thing) {
        return new Promise(async (resolve, reject) => {
            try {
                await rootState.db.collection('factors').add(thing);
                commit('add', thing);
                resolve();
            } catch (e) {
                commit('setError', e, { root: true });
                console.log(e);
                reject(e);
            }
        });
    },

    save ({ commit, rootState }, thing) {
        return new Promise(async (resolve, reject) => {
            try {
                await rootState.db.collection('factors').doc(thing.id).set(thing);
                commit('set', thing);
                resolve(thing);
            } catch (e) {
                commit('setError', e, {root: true });
                console.log(e);
                reject(e);
            }
        });
    },

    delete ({ commit, rootState}, thing) {
        return new Promise(async (resolve, reject) => {
            try {
                await rootState.db.collection('factors').doc(thing.id).delete();
                commit('delete', thing);
                resolve();
            } catch (e) {
                commit('setError', e, { root: true});
                console.log(e);
                reject(e);
            }
        });
    },
};

const mutations = {
    set_all(state, things) {
        state.all = things;
    },

    set(state, thing) {
        let i = state.all.findIndex(t => t.id === thing.id);
        state.all[i] = thing;
    },

    add(state, thing) {
        state.all = [...state.all, thing];
    },

    delete(state, payload) {
        state.all = state.all.filter(t => t.id !== payload.id);
    },


};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};