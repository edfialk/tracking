<template>
    <div class="container">

      <!-- <h1 class="cover-heading">Hi Lerb.</h1> -->

      <div class="my-5">
        <router-link to="/rate" class="btn btn-lg btn-primary btn-block">Rate Yoself</router-link>
        <router-link to="/thing/add" class="btn btn-lg btn-primary btn-block">Add a Thing</router-link>
        <router-link to="/photo" class="btn btn-lg btn-primary btn-block">Selfie!</router-link>
      </div>

      <Chart :chartData="chartData" :annotations="activeThings"></Chart>

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
      activeThings: [],
    };
  },

  mounted() {
    this.$emit('reset');
  },

  methods: {

    toggleThing(thing, color){

      let i = this.activeThings.findIndex(e => {
        return e.thing.id === thing.id;
      });

      if (i >= 0){
        this.activeThings.splice(i, 1);
        return;
      }

      this.activeThings.push({ thing, color });
    }

  },

  computed: {

    chartData() {

      return this.ratings.map(rating => {
        return { x: rating.date, y: rating.rating };
      });

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
