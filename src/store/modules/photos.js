import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

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
};

const actions = {
    get ({ commit, rootState }) {
        return new Promise(async (resolve, reject) => {
            try {

                commit('status', 'loading');
                commit('error', null);

                let doc = firebase.firestore().collection('photos').doc(rootState.user.uid);
                let resp = await doc.get();
                let all = {};
                if (resp.exists) {
                    all = resp.data();
                    //convert firebase timestamps to date
                    for (let tracker in all) {
                        all[tracker] = all[tracker].map(rating => {
                            if (rating.date && rating.date.toDate){
                                rating.date = rating.date.toDate()
                            }
                            return rating;
                        });
                    }
                } else {
                    await doc.set({});
                }

                commit('set', all);
                commit('status', 'success');

                resolve();
            } catch (e) {
                commit('error', e);
                reject(e);
            }
        });
    },

    add ({ commit, rootState }, { tracker, blob }) {
        return new Promise(async (resolve, reject) => {

            if (!tracker) {
                commit('error', 'Photo is missing tracker.');
                reject('Photo is missing tracker.');
            }
            if (!blob) {
                commit('error', 'Photo is missing blob.');
                reject('Photo is missing blob');
            }

            let ref;

            try {
                
                commit('status', 'loading');
                
                const id = Date.now();
                const date = new Date(id);
                const imagePath = `/photos/${rootState.user.uid}/${tracker}/images/${id}.png`;
                ref = firebase.storage().ref().child(imagePath);
                
                await ref.put(blob);

                let url = await ref.getDownloadURL();

                let photos = [];
                if (state.all[tracker])
                    photos = state.all[tracker].slice();

                photos.push({ id, date, url });

                let update = {};
                update[tracker] = photos;

                await firebase.firestore().collection('photos').doc(rootState.user.uid).update(update);

                commit('add', { id, date, url, tracker });
                commit('status', 'success');
                resolve(url);

            } catch(e) {
                ref.delete();
                commit('error', e);
                reject(e);
            }

            // try {

            //     let photo = { date, url };
            //     let photos = [];
            //     if (state.all[tracker])
            //         photos = state.all[tracker].slice();
                
            //     photos.push(photo);
                
            //     let update = { id: now };
            //     update[tracker] = photos;
                
            //     await firebase.firestore().collection('photos').doc(rootState.user.uid).update(update);
                
            //     commit('add', { tracker, photo });
            //     commit('status', 'success');
            //     resolve(update);
            // } catch (e) {
            //     //delete photo from storage
            //     await ref.delete();

            //     commit('error', e);
            //     reject(e);
            // }
        });
    },

};

const mutations = {
    set(state, payload) {
        Vue.set(state, 'all', payload);
    },

    add(state, { date, id, url, tracker }) {
        state.all[tracker] = state.all[tracker] || [];
        state.all[tracker].push({ date, id, url });
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