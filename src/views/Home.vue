<template>
  <div>


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

		<div class="container bg-blue pb-3">

			<Chart
				:chartData="chartData"
				:regions="selectedThings"
				:xmin="xmin"
				:xmax="xmax"
			></Chart>

			<div class="border-top bg-grey rounded-bottom">
				<button
					class="btn btn-link text-dark text-decoration-none mx-auto d-block"
					type="button"
					data-toggle="collapse"
					data-target="#things"
					@click="toggleThings"
					:class="showThingsDisplay ? 'active' : ''"
				>
					Show Tests
				</button>
				<div
					class="collapse container bg-grey border-top"
					id="things"
				>
					<Things @toggleThing="toggleThing"></Things>
				</div>
			</div>
		</div>


				<router-link to="/rate" tag="div" class="block bg-blue text-light shadow">
					<div class="d-flex align-items-center justify-content-start">
						<div>
							<span class="oi oi-bell h5 ml-1 mr-4"></span>
						</div>
						<div>
							<h4>
								Add a rating
							</h4>
							<p class="mb-0">How are you feeling today?</p>
						</div>
					</div>
				</router-link>

				<router-link to="/tracker/add" tag="div" class="block bg-blue text-light shadow">
					<div class="d-flex align-items-center justify-content-start">
						<div>
							<span class="oi oi-bar-chart h5 ml-1 mr-4"></span>
						</div>
						<div>
							<h4>
								Start tracking
							</h4>
							<p class="mb-0">Another line for the graph.</p>
						</div>
					</div>
				</router-link>

				<router-link to="/thing/add" tag="div" class="block bg-blue text-light shadow">
					<div class="d-flex align-items-center justify-content-start">
						<div>
							<span class="oi oi-book h5 ml-1 mr-4"></span>
						</div>
						<div>
							<h4>
								Record a Factor
							</h4>
							<p class="mb-0">New goop, vacation, anything.</p>
						</div>
					</div>
				</router-link>

				<router-link to="/photo" tag="div" class="block bg-blue text-light shadow">
					<div class="d-flex align-items-center justify-content-start">
						<div>
							<span class="oi oi-camera-slr h5 ml-1 mr-4"></span>
						</div>
						<div>
							<h4>
								Selfie
							</h4>
							<p class="mb-0">This isn't working yet.</p>
						</div>
					</div>
				</router-link>

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
