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
                <tr v-for="(tracker, name) in all" :key="name">
                    <td>{{ name }}</td>
                    <td class="text-center text-danger"><span class="oi oi-x"></span></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>

import { mapState } from 'vuex';

export default {

    computed: {

        ...mapState('ratings', ['all']),

    },



}

</script>