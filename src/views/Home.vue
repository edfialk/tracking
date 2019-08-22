<template>
  <div>

    <div class="fixed-top pt-2">

      <Chart
        :chartData="chartData"
        :regions="regions"
      ></Chart>

    </div>

    <div
      class="container"
      style="margin-top: 262px"
    >
      <Things @setRegions="setRegions"></Things>
    </div>

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
    ...mapState("ratings", {
      ratings: "all"
    }),

    chartData() {
      let data = {
        type: "spline",
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
