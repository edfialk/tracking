<template>
  <div class="container pt-3">
    <form @submit.prevent="save">
      <div class="form-group">
        <label for="name">What would you like to track?</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="name"
          required
        >
        <small class="form-text text-muted">This will be the legend text on the graph for this line, so keep it short and unique.</small>
      </div>
      <div class="form-group">
        <label>Want to set a starting rating?</label>
        <div class="row">
          <div class="col">
            <button
              type="button"
              class="btn btn-block"
              :class="{ 'btn-info' : !hasStartRating, 'btn-success' : hasStartRating }"
							@click="hasStartRating=true"
            >Yes</button>
          </div>
          <div class="col">
            <button
              type="button"
              class="btn btn-block"
              :class="{ 'btn-info' : hasStartRating, 'btn-success' : !hasStartRating }"
							@click="hasStartRating=false"
            >No</button>
          </div>
        </div>
      </div>
			<div class="form-group">
				<label>What's the rating?</label>
        <input type="range" class="form-control-range" v-model="startRating">
				<p class="text-center mt-3">{{ Math.round(startRating / 10) }}</p>
			</div>
			<div class="alert alert-danger" v-if="errorMessage">{{ errorMessage }}</div>
			<div class="form-group">
				<button type="submit" class="btn btn-primary btn-block" :class="{ disabled: isLoading }">Save</button>
			</div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import * as moment from 'moment';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

export default {
  data() {
    return {
      name: "",
			hasStartRating: true,
			startRating: 50,
			isLoading: false,
			errorMessage: ""
    };
	},
	
	methods: {
		...mapActions('trackers',
			['add']
		),

		...mapActions('ratings', {
				rate: 'add'
			}
		),

		async save() {
			this.isLoading = true;

			try {
				let tracker = await this.add({
					name: this.name,
					user_id: this.$store.state.user.id
				});
	
	
				if (this.hasStartRating){
					await this.rate({
						value: this.startRating
					});
				}

				this.success();
			} catch (e){
				this.error(e);
			}
			
		},

		success() {
			this.$router.push('/kitty');
		},

		error(error) {
			this.errorMessage = error;
		},
	},
};
</script>
