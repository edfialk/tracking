<template>
  <div class="container pt-3">

    <form @submit.prevent="save">

      <div class="form-group">
        <label for="name">What would you like to call this?</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="thing.name"
          required
          @change="onNameChange"
        >
      </div>

      <div class="form-group">
        <label>How long did you do it?</label>
        <div class="d-flex justify-content-around align-items-center">
          <button
            type="button"
            class="btn"
            :class="{ 
              'btn-success shadow' : isSingleUse,
              'btn-light'   : !isSingleUse,
            }"
            @click="isSingleUse=true"
          >One Time</button>
          <button
            type="button"
            class="btn"
            :class="{
              'btn-success shadow' : !isSingleUse,
              'btn-light'   : isSingleUse,
            }"
            @click="isSingleUse = false"
          >For a While</button>
        </div>
      </div>

      <div
        class="form-group"
        v-if="!isSingleUse"
      >
        <label>Are you still using it?</label>
        <div class="d-flex justify-content-around">
          <button
            type="button"
            class="btn"
            :class="{ 
              'btn-success shadow' : active,
              'btn-light'   : !active,
            }"
            @click="active = true"
          >Yes</button>
          <button
            type="button"
            class="btn"
            :class="{
              'btn-success shadow' : !active,
              'btn-light'   : active,
            }"
            @click="active = false"
          >No</button>
        </div>
      </div>

      <div
        class="form-group"
        v-if="isSingleUse"
      >
        <label>When did you do it?</label>
        <datetime
          :bootstrap-styling="true"
          input-class="form-control"
          v-model="date"
          ref="singleDate"
          value-zone="America/Los_Angeles"
          format="DDDD"
        ></datetime>
      </div>


      <div
        class="form-group"
        v-if="!isSingleUse && active"
      >
        <label>When did you start?</label>
        <datetime
          :bootstrap-styling="true"
          input-class="form-control"
          v-model="since"
          ref="startDate"
          value-zone="America/Los_Angeles"
          format="DDDD"
        ></datetime>
      </div>

      <div
        class="form-group"
        v-if="!isSingleUse && !active"
      >
        <label>When did you start?</label>
        <datetime
          :bootstrap-styling="true"
          input-class="form-control"
          v-model="start"
          ref="startDate"
          value-zone="America/Los_Angeles"
          :max-datetime="end"
          format="DDDD"
        ></datetime>
      </div>

      <div
        class="form-group"
        v-if="!isSingleUse && !active"
      >
        <label>When did (or will) you stop?</label>
        <datetime
          :bootstrap-styling="true"
          input-class="form-control"
          v-model="end"
          ref="endDate"
          value-zone="America/Los_Angeles"
          :min-datetime="start"
          format="DDDD"
        ></datetime>
      </div>

      <div
        class="bg-danger text-light p-3 mb-3 shadow rounded"
        v-if="error"
      >
        {{ error }}
      </div>

      <router-link :to="takenNameURL" tag="div"
        class="bg-danger text-light p-3 mb-3 shadow rounded"
        v-if="isNameTaken"
      >
        That name is already taken. Click this box if you want to see it.
      </router-link>


      <div class="form-group">
        <button
          type="submit"
          class="btn btn-block btn-primary shadow"
          :class="{ disabled: loading }"
        >
          <span
            class="oi oi-reload spinner"
            v-if="loading"
          ></span>
          <span v-else>Save</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      thing: {
        name: "",
      },
      active: true,
      start: null,
      end: null,
      date: null,
      since: null,
      isSingleUse: true,
      isNameTaken: false,
      takenNameURL: null,
      error: null,
      loading: false
    };
  },

  methods: {

    validate() {

      if (this.isSingleUse && !this.date) {
        this.error = "You need to set a date.";
        // this.$refs['singleDate'].focus();
        return false;
      }

      if (!this.isSingleUse && this.active && !this.thing.since) {
        this.error = "You need to set a start date.";
        // this.$refs['startDate'].focus();
        return false;        
      }

      if (!this.isSingleUse && !this.active && !this.start) {
        this.error = "You need to set a start date.";
        // this.$refs['startDate'].focus();
        return false;        
      }
      
      if (!this.isSingleUse && !this.active && !this.end) {
        this.error = "You need to set an end date.";
        // this.$refs['endDate'].focus();
        return false;
      }

      if (this.isNameTaken) {
        this.error = "That name is taken."
        return false;
      }

      return true;

    },

    async save() {

      if (!this.validate) return;

      let date = {};
      if (this.isSingleUse) {
        date.date = new Date(this.date);
        this.thing.dates = [date];
      } else if (this.active) {
        this.thing.since = new Date(this.since);
      } else {
        date.start = new Date(this.start);
        date.end = new Date(this.end);
        this.thing.dates = [date];
      }

      try {

        this.loading = true;

        await this.$store.dispatch('things/add', this.thing);

        this.loading = false;
        this.$router.push('/kitty');

      } catch (e) {
        this.error = e;
      }

    },

    onNameChange() {
      let t = this.$store.getters['things/name'](this.thing.name);
      if (t) {
        this.isNameTaken = true;
        this.takenNameURL = '/thing/' + t.name;
      }
    }
  },

  watch: {
    isSingleUse(val) {
      if (val) {
        this.start = null;
        this.end = null;
      } else {
        this.date = null;
      }
    },

    active(val) {
      if (val) {
        this.end = null;
        this.end = null;
      } else {
        this.thing.since = null;
      }
    },

    thing: {
      handler() {
        this.error = '';
      },
      deep: true
    }
  }

};
</script>