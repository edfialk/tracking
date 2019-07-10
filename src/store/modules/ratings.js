const state = {
    all: []
};

const getters = {
    get: state => {
        return state.all.reduce((acc, cur) => {
            if (cur.tracker){
                acc[cur.tracker] = acc[cur.tracker] || [];
                acc[cur.tracker].push(cur);
            }
            return acc;
        }, {});
    },
    tracker: (state) => (tracker) => {
        return state.all.filter(rating => rating.tracker === tracker);
    },
};

const actions = {
    // get ({ commit, rootState }) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let query = rootState.db.collection('ratings');
    //             let resp = await query.get();
    //             let all = resp.docs.map(doc => {
    //                 return {
    //                     ...doc.data(),
    //                     date: new Date(doc.data().date.toMillis())
    //                 };
    //             });
    //             commit('set', all);
    //             resolve(all);
    //         } catch (e) {
    //             commit('error', e, { root: true });
    //             console.log(e);
    //             reject(e);
    //         }
    //     });
    // },

    add ({ commit, rootState }, rating) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!rating.tracker) {
                    commit('error', 'Invalid rating.', { root: true });
                    reject('Invalid rating.');
                }

                let trackerRef = await rootState.db.collection(rating.tracker);
                if (!trackerRef) {
                    commit('error', 'Tracker not found.', { root: true });
                    reject('Tracker not found.');
                }
                
                rating.date = new Date();
                let ratingRef = await trackerRef.collection('ratings').add(rating);
                rating.id = ratingRef.id;
                commit('add', rating);
                resolve(rating);
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