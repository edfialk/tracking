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
        <label>What should it start at?</label>
        <input
          type="range"
          class="form-control-range"
          v-model="rating"
          min="0"
          max="10"
        >
        <p
          class="text-center mt-3"
          v-text="rating"
        ></p>
      </div>
      <div
        class="alert alert-danger"
        v-if="errorMessage"
      >{{ errorMessage }}</div>
      <div class="form-group">
        <button
          type="submit"
          class="btn btn-primary btn-block"
          :class="{ disabled: isLoading }"
        >Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
// import * as moment from "moment";

export default {
  data() {
    return {
      name: "",
      rating: 5,
      isLoading: false,
      errorMessage: ""
    };
  },

  methods: {
    // ...mapActions({
		// 	add: 'addTracker'
		// }),

    ...mapActions('ratings', {
      rate: 'add'
    }),

    async save() {
      this.isLoading = true;

      try {
				// await this.add(this.name);

				await this.rate({
					value: this.rating,
					tracker: this.name
        });

        this.success();
      } catch (e) {
        this.error(e);
      }
    },

    success() {
      this.$router.push("/kitty");
    },

    error(e) {
      this.errorMessage = e;
    }
  }
};
</script>
