<template>
  <div class="h-100">

    <div v-if="status == 'success' && hasRatings">
      <div class="fixed-top pt-2">
        <Chart
          :chartData="chartData"
          :regions="regions"
        ></Chart>
      </div>

      <div class="container" style="padding-top: 262px">
        <Things @setRegions="setRegions"></Things>
      </div>

    </div>

    <transition
      name="fade"
    >
      <div v-if="status == 'success' && !hasRatings" class="px-3 d-flex flex-column h-100 justify-content-center">
        <h3>Hello!</h3>
        <h5>Click the green circle below to start tracking stuff.</h5>
      </div>
    </transition>

  </div>
</template>

<script>
import { mapState } from "vuex";
import Things from "../components/ThingsTable";
import Chart from "../components/Chart";

export default {
  name: "home",

  components: { Things, Chart },

  data() {
    return {
      regions: {},
    };
  },

  methods: {
    setRegions(regions) {
      this.regions = regions;
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

    chartData() {
      let data = {
        type: 'spline',
        xs: {},
        columns: []
      };

      let ratings = this.ratings;

      for (let t in ratings) {
        data.xs[t] = "x" + t;

        let x = ["x" + t];
        let y = [t];

        ratings[t].forEach(rating => {
          x.push(rating.date);
          y.push(rating.value);
        });

        data.columns.push(x, y);
      }

      return data;
    },

  } //computed
};
</script>
