<template>
     <div class="container pt-3 text-center" id="view--rate">
        <div v-if="myRating.tracker">
            <div class="form-group">
                <select class="form-control" id="trackerSelect" v-model="myRating.tracker">
                    <option v-for="(tracker, index) in trackers" :key="index" :value="tracker">{{ tracker }}</option>
                </select>
            </div>
            <div class="shadow p-3 mb-3 bg-white rounded text-dark">
                <div v-if="lastRating">
                    <h5>Last Rating: {{ lastRating.value }}</h5>
                    <h5>from {{ lastRating.date | ago }}</h5>
                </div>
                <p class="mb-0">How bad is it now?</p>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <button class="btn btn-block btn-success shadow py-3" @click="modifyRating(1)">A little better</button>
                </div>
                <div class="col">
                    <button class="btn btn-block btn-danger shadow py-3" @click="modifyRating(-1)">A little worse</button>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <button class="btn btn-block btn-success shadow py-3" @click="modifyRating(2)">A lot better</button>
                </div>
                <div class="col">
                    <button class="btn btn-block btn-danger shadow py-3" @click="modifyRating(-2)">A lot worse</button>
                </div>
            </div>
            <div class="form-group shadow p-3 mb-3 bg-white rounded">
                <label for="inputRange">Or you can drag this thing</label>
                <input type="range" class="form-control-range" id="inputRange" v-model="myRating.value" min="0" max="10">
            </div>
            <div class="bg-danger text-light p-3 mb-3 shadow rounded" v-if="error">
                {{ error }}
            </div>
            <button class="btn btn-block btn-primary btn-lg shadow" :class="{ disabled: loading }" @click="save">
                <span class="oi oi-reload spinner" v-if="loading"></span>
                <span v-else>Save</span>
            </button>
        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex';

export default {

    data() {
        return {
            myRating: {
                tracker: '',
                value: 5,
                date: new Date()
            },
            error: null,
            loading: false,
        }
    },

    computed: {
        ...mapState('ratings', {
            ratings: 'all',
            status: 'status'
        }),

        hasRatings() {
            return this.$store.getters['ratings/hasRatings']();
        },

        trackers() {
            return this.$store.getters['ratings/trackers']();
        },

        lastRating() {
            if (this.ratings && this.ratings[this.myRating.tracker]){
                return this.ratings[this.myRating.tracker].reduce((acc, cur) => {
                    if (cur.date > acc.date)
                        return cur;
                    return acc;
                });
            }

            return null;
        }

    },

    created() {

        if (this.status == 'success' && !this.hasRatings){
            return this.$router.push('/tracker/add');
        }

        if (this.trackers && this.trackers.length > 0){
            this.myRating.tracker = this.trackers[0];
            this.myRating.value = this.lastRating.value;
        }
    },

    methods: {
        modifyRating(change){
            this.myRating.value = parseInt(this.lastRating.value) + change;
        },

        async save() {

            try {
                this.loading = true;

                await this.$store.dispatch('ratings/add', this.myRating);

                this.loading = false;
                this.$router.push('/kitty');

            } catch (e) {
                this.error = e;
            }
        },
    },

    watch: {
        trackers(val) {
            if (val && val.length > 0 && !this.myRating.tracker)
                this.myRating.tracker = val[0];
            
            if (val && val.length == 0)
                this.$router.push('/tracker/add');
        },

        'myRating.tracker'() {
            if (this.lastRating) 
                this.myRating.value = this.lastRating.value;
        }
    }

};

</script>


