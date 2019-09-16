<template>
    <div class="h-100">
        <table class="table shadow" v-if="Object.keys(all).length > 0">
            <thead>
                <tr>
                    <th>Name</th>
                    <th class="text-center">Delete</th>
                </tr>
            </thead>
            <transition-group tag="tbody" class="bg-white" name="slide-right">
                <tr v-for="(tracker, name) in all" :key="name+''">
                    <td>{{ name }}</td>
                    <td class="text-center text-danger">
                        <span class="oi oi-x" @click="del(name)"></span>
                    </td>
                </tr>
            </transition-group>
        </table>
        <div v-else class="flex h-100 p-4">
            <div>
                <h5><router-link to="/tracker/add">Click here</router-link> to start tracking something, like an ache, a pain, or a superpower.</h5>
                <h6 class="mt-5">You can track more things later by coming to this page and clicking the plus in the green circle below.</h6>
            </div>
        </div>
        <div class="add-text text-center" v-if="Object.keys(all).length == 1">
            Add more trackers here<br>
            <span class="oi oi-arrow-bottom vert-move"></span>
        </div>
    </div>
</template>


<script>

import { mapState } from 'vuex';

export default {

    computed: {
        ...mapState('ratings', ['all']),
    },

    methods: {
        async del(name) {
            if (confirm("This will delete this tracker and all ratings, are you sure?")) {
                await this.$store.dispatch('ratings/deleteTracker', name);
            }
        }
    }

}

</script>