<template>
    <div class="container pt-3">

      <Chart :chartData="chartData" :regions="selectedThings" :xmin="xmin" :xmax="xmax"></Chart>

      <div class="mb-3">
        <router-link to="/rate" class="btn btn-lg btn-primary btn-block">Rate Yoself</router-link>
        <router-link to="/photo" class="btn btn-lg btn-primary btn-block">Selfie!</router-link>
        <router-link to="/thing/add" class="btn btn-lg btn-primary btn-block">Add a Thing</router-link>
        <router-link to="/tracker/add" class="btn btn-lg btn-primary btn-block">Track Something</router-link>
      </div>


      <Things @toggleThing="toggleThing"></Things>
    </div>
</template>

<script>

// import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
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
    },

  }, //methods

  computed: {

    ...mapState('ratings', {
      ratings: 'all'
    }),

    ...mapGetters('ratings', ['since', 'maxCountSince']),

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
				data.xs[t] = 'x' + t;
				
        let x = ['x' + t];
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
		}

  }, //computed

}

</script>
