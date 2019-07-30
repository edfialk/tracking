<template>
  <div>

    <div class="fixed-top">
      <div class="header p-2 bg-blue">
        <!-- <div class="ham">
					<button class="ham--icon"></button>
					<div class="ham--content">
						<a href="">link</a>
						<a href="">link</a>
						<a href="">link</a>
					</div>
				</div> -->

        <div class="dropdown mx-auto">
          <!-- <button
						type="button"
						data-toggle="dropdown"
					>{{ timerange }}</button>
					<div class="dropdown-menu">
						<button>This Week</button>
						<button>This Month</button>
						<button>This Year</button>
					</div> -->
          <select
            v-model="timerange"
            class="transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <Chart
        :chartData="chartData"
        :regions="regions"
        :xmin="xmin"
        :xmax="xmax"
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
import moment from "moment";
import { mapState, mapGetters } from "vuex";
import Things from "../components/ThingsTable";
import Chart from "../components/Chart";

export default {
  name: "home",

  components: { Things, Chart },

  data() {
    return {
      regions: {},
      timerange: "week",
      ranges: {
				week: moment().subtract(1, "week").toDate(),
        month: moment().subtract(1, "month").toDate(),
        year: moment().subtract(1, "year").toDate()
			},
      xmin: null
    };
  },

  created() {
    this.xmin = this.ranges.week;
  },

  methods: {
    setRegions(colors) {
      this.regions = colors;
		}
		
  }, //methods

  watch: {
    timerange(val) {
      this.xmin = this.ranges[val];
    }
  },

  computed: {
    ...mapState("ratings", {
      ratings: "all"
    }),

    ...mapGetters("ratings", ["since", "maxCountSince"]),

    chartData() {
      let data = {
        type: "spline",
        xs: {},
        columns: []
      };

      //get 7 days or 2 points

      // let ratings = this.since(this.weekago);
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

    xmax() {
      return new Date();
    }
  } //computed
};
</script>
