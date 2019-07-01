<template>
     <div class="container h-100 pt-3 text-center">
        <div>
            <div class="shadow p-3 mb-3 bg-white rounded text-dark">
                <div v-if="lastRating">
                    <h3>Last Rating: {{ lastRating.rating }}</h3>
                    <h5>from {{ lastRating.date | date }}</h5>
                </div>
                <h5 class="mb-0">How bad is it now?</h5>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <button class="btn btn-block btn-success btn-lg shadow" @click="modifyRating(10)">A little better</button>
                </div>
                <div class="col">
                    <button class="btn btn-block btn-danger btn-lg shadow" @click="modifyRating(-10)">A little worse</button>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <button class="btn btn-block btn-success btn-lg shadow" @click="modifyRating(20)">A lot better</button>
                </div>
                <div class="col">
                    <button class="btn btn-block btn-danger btn-lg shadow" @click="modifyRating(-20)">A lot worse</button>
                </div>
            </div>
            <div class="form-group shadow p-3 mb-3 bg-white rounded">
                <label for="inputRange">Or you can poke this thing</label>
                <input type="range" class="form-control-range" id="inputRange" v-model="newRating">
            </div>
            <div class="bg-danger text-light p-3 mb-3 shadow rounded" v-if="status.error">
                {{ status.error }}
            </div>
            <button class="btn btn-block btn-primary btn-lg shadow" :class="{ disabled: status.loading }" @click="save">
                <span class="oi oi-reload spinner" v-if="status.loading"></span>
                <span v-else>Save</span>
            </button>
        </div>
    </div>
</template>

<script>

export default {

    props: {
        ratings: {
            type: Array
        },
        status: {
            type: Object
        }
    },

    data() {
        return {
            newRating: 50,
        }
    },

    computed: {
        lastRating() {
            if (this.ratings && this.ratings.length > 0){
                return this.ratings.reduce((acc, cur) => {
                    if (cur.date > acc.date)
                        return cur;
                    return acc;
                });
            }

            return null;
        }
    },

    methods: {
        modifyRating(change){
            this.newRating = this.lastRating.rating * 10 + change;
        },

        save() {
            this.$emit('saveRating', Math.round(this.newRating / 10));
        },
    },

    watch: {
        status:{
            handler(val) {
                if (!val.loading && !val.error){
                    this.$router.push('/kitty');
                }
            },
            deep: true
        }
    },

};

</script>
