import Vue from 'vue';

const state = {
    all: {},
    status: null,
    error: null
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
                let resp = await rootState.db.collection('factors').doc(rootState.user.uid).get();
                let all = resp.data();
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
                commit('set', all);
                commit('status', 'success');
                resolve(all);
            } catch (e) {
                commit('error', e, { root: true });
                reject(e);
            }
        });
    },

    add ({ commit, rootState }, thing) {
        return new Promise(async (resolve, reject) => {
            try {
                commit('status', 'loading');
                let ref = await rootState.db.collection('factors').doc(rootState.user.uid).add(thing);
                thing.id = ref.id;
                commit('add', thing);
                commit('status', 'success');
                resolve(thing);
            } catch (e) {
                commit('error', e, { root: true });
                reject(e);
            }
        });
    },

    save ({ commit, rootState }, thing) {
        return new Promise(async (resolve, reject) => {
            try {
                let update = {};
                update[thing.name] = thing;
                await rootState.db.collection('factors').doc(rootState.user.uid).update(update);
                commit('update', thing);
                resolve(thing);
            } catch (e) {
                commit('error', e, {root: true });
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
                commit('error', e, { root: true });
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
        state.all = [...state.all, thing];
    },

    update(state, thing) {
        state.all[thing.name] = thing;
    },

    delete(state, payload) {
        this.$delete(state.all, payload.name);
    },
    
    status(state, payload) {
        state.status = payload;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};