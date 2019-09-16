<template>

    <div class="h-100">
        <table class="table shadow" v-if="Object.keys(all).length > 0">
            <thead>
                <tr>
                    <th>Name</th>
                    <th class="text-center">Delete</th>
                    <th class="text-center">View</th>
                </tr>
            </thead>
            <transition-group tag="tbody" class="bg-white" name="slide-right">
                <tr v-for="thing in all" :key="thing.name">
                    <td>{{ thing.name }}</td>
                    <td class="text-center text-danger" @click="del(thing)">
                        <span class="oi oi-x"></span>
                    </td>
                    <td class="text-center">
                        <router-link :to="'/thing/' + thing.name">
                            <span class="oi oi-chevron-right text-muted lead"></span>
                        </router-link>
                    </td>
                </tr>
            </transition-group>
        </table>
        <div v-else class="flex h-100 p-4">
            <div>
                <h5><router-link to="/thing/add">Click here</router-link> to make a record of something that might influence what you are tracking, like a medicine, shampoo, or big fluffy stuffed unicorn.</h5>
                <h6 class="mt-5">You can add more factors later by coming to this page and clicking the plus in the green circle below.</h6>
            </div>
        </div>
        <div class="add-text text-center" v-if="Object.keys(all).length == 1">
            Add more factors here<br>
            <span class="oi oi-arrow-bottom vert-move"></span>
        </div>
    </div>

</template>

<script>

import { mapState } from 'vuex';

export default {

    computed: {
        ...mapState('things', ['all'])
    },

    methods: {
        del(thing) {
            if (confirm("Are you sure?")){
                this.$store.dispatch('things/delete', thing.name);
            }
        }
    }



}

</script>