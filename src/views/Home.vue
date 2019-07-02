<template>
    <div class="container">

      <!-- <h1 class="cover-heading">Hi Lerb.</h1> -->

      <div class="mb-3">
        <router-link to="/rate" class="btn btn-lg btn-primary btn-block">Rate Yoself</router-link>
        <router-link to="/photo" class="btn btn-lg btn-primary btn-block">Selfie!</router-link>
        <router-link to="/thing/add" class="btn btn-lg btn-primary btn-block">Add a Thing</router-link>
        <router-link to="/tracker/add" class="btn btn-lg btn-primary btn-block">Track Something</router-link>
      </div>

      <Chart :chartData="chartData" :regions="selectedThings"></Chart>

      <Things @toggleThing="toggleThing"></Things>
    </div>
</template>

<script>

import { mapState } from 'vuex';
import Things from '../components/Things';
import Chart from '../components/Chart';

export default {

  name: 'home',
  
  components: { Things, Chart },

  data() {
    return {
      selectedThings: [],
    };
  },

  methods: {

    toggleThing(thing, color){

      let i = this.selectedThings.findIndex(e => e.thing.id === thing.id);

      if (i >= 0){
        this.selectedThings.splice(i, 1);
        return;
      }

      this.selectedThings.push({ thing, color });
    }

  },

  computed: {

    ...mapState('ratings', {
      ratings: 'all'
    }),

    chartData() {

      let data = {
        type: "spline",
        xs: {},
        columns: []
      };

      let dates = {};
      let ratings = {};

      this.ratings.forEach(rating => {
        let t = rating.tracker;
        if (!dates[t]) {
          dates[t] = [];
        }
        if (!ratings[t]) {
          ratings[t] = [];
        }

        dates[t].push(rating.date);
        ratings[t].push(rating.rating);
      });

      for (let series in dates) {
        data.xs[series] = 'x' + series;
        data.columns.push([series, ...ratings[series]]);
        data.columns.push(['x' + series, ...dates[series]]);
      }

      return data;

    },


  },

}

</script>

<style lang="scss" scoped>
.table tr td+td {
  text-align: right;
}
.table tr:hover {
  cursor: pointer;
}
</style>
