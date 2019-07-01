<template>
    <div class="container">

      <!-- <h1 class="cover-heading">Hi Lerb.</h1> -->

      <div class="mb-3">
        <router-link to="/rate" class="btn btn-lg btn-primary btn-block">Rate Yoself</router-link>
        <router-link to="/thing/add" class="btn btn-lg btn-primary btn-block">Add a Thing</router-link>
        <router-link to="/photo" class="btn btn-lg btn-primary btn-block">Selfie!</router-link>
        <router-link to="/tracker/add" class="btn btn-lg btn-primary btn-block">Track Something</router-link>
      </div>

      <Chart :chartData="chartData" :regions="selectedThings"></Chart>

      <Things :things="things" @toggleThing="toggleThing"></Things>
    </div>
</template>

<script>

import Things from '../components/Things';
import Chart from '../components/Chart';

export default {

  name: 'home',
  
  props: {
    things: {
      type: Array
    },
    ratings: {
      type: Array
    }
  },

  components: { Things, Chart },

  data() {
    return {
      selectedThings: [],
    };
  },

  mounted() {
    this.$emit('reset');
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

    chartData() {

      let x = ['date'];
      let y = ['rating'];

      this.ratings.forEach(rating => {
        x.push(new Date(rating.date));
        y.push(rating.rating);
      });

      return {
        columns: [ x, y ]
      };

    }

  }

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
