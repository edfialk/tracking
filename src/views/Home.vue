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
					<button
						type="button"
						data-toggle="dropdown"
					>This Week</button>
					<div class="dropdown-menu">
						<button>This Month</button>
						<button>This Year</button>
					</div>
				</div>
			</div>

			<Chart
				:chartData="chartData"
				:regions="selectedThings"
				:xmin="xmin"
				:xmax="xmax"
			></Chart>

		</div>

		<div class="container" style="margin-top: 262px">
			<Things @toggleThing="toggleThing"></Things>
		</div>

  </div>
</template>

<script>
// import moment from 'moment';
import { mapState, mapGetters } from "vuex";
import Things from "../components/Things";
import Chart from "../components/Chart";

export default {
  name: "home",

  components: { Things, Chart },

  data() {
    return {
      selectedThings: [],
      showThingsDisplay: false
    };
  },

  methods: {
    toggleThing(thing, color) {
      let i = this.selectedThings.findIndex(e => e.thing.id === thing.id);

      if (i >= 0) {
        this.selectedThings.splice(i, 1);
        return;
      }

      this.selectedThings.push({ thing, color });
		},
		
		toggleThings() {
			this.showThingsDisplay = !this.showThingsDisplay;
		}
  }, //methods

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
    },

    xmin() {
      return this.weekago;
    },

    weekago() {
      let date = new Date();
      date.setDate(date.getDate() - 7);
      return date;
    },

    toggleThingsText() {
      return this.showThingsDisplay ? "hide" : "display factors";
    }
  } //computed
};
</script>
