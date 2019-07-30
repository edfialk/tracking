<template>

    <div>
        <table class="table shadow">
            <thead>
                <tr>
                    <th>Name</th>
                    <th class="text-center">Delete</th>
                </tr>
            </thead>
            <tbody class="bg-white">
                <tr v-for="thing in all" :key="thing.name">
                    <td>{{ thing.name }}</td>
                    <td class="text-center text-danger" @click="del(thing)">
                        <span class="oi oi-x"></span>
                    </td>
                </tr>
            </tbody>
        </table>
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
                this.$store.dispatch('things/delete', thing);    
            }
        }
    }



}

</script>