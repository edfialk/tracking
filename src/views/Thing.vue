<template>

  <div
    class="container h-100"
    v-if="thing"
  >
    <div class="p-3 mb-3 bg-light rounded shadow text-center">
      <h4 class="mb-0">
        <span v-if="thing.active">You have been using {{ thing.name }} since {{ thing.since | date }}</span>
        <span v-else>You last used {{ thing.name }} on {{ latestDate | date }}</span>
      </h4>
    </div>

    <div class="mb-3">
      <button
        v-if="!thing.active"
        type="btn"
        class="btn btn-info btn-block"
        data-toggle="modal"
        data-target="#modal-start"
      >Use {{ thing.name }}</button>
      <button
        v-if="thing.active"
        type="btn"
        class="btn btn-info btn-block"
        @mouseup="stop"
      >Stop using this thing</button>
    </div>

    <div class="mb-3 p-3 bg-light rounded shadow text-center">
      <Chart :chartData="chartData" :xmin="xmin" :xmax="xmax" :regions="chartRegions"></Chart>
    </div>

    <DateTable
      :dates="thing.dates"
      @save="setDates"
      v-if="thing.dates && thing.dates.length > 0"
    ></DateTable>

    <div class="mb-3">
      <button
        type="btn"
        class="btn btn-info btn-block"
        data-toggle="modal"
        data-target="#modal-name"
      >Change Name</button>
      <button
        type="btn"
        class="btn btn-danger btn-block"
        @click="onClickDelete"
      >Delete this thing</button>
    </div>

    <div
      class="modal fade"
      id="modal-name"
      role="dialog"
    >
      <div
        class="modal-dialog"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Enter new name</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="onSubmitName">
              <input
                type="text"
                class="form-control"
                v-model.trim="inputName"
                ref="input-name"
                autofocus
              />
            </form>
            <div class="alert alert-danger mt-3" v-if="isNameTaken">
              That name is already taken. Please use another.
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="onSubmitName"
            >Change Name</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="modal-start"
      role="dialog"
    >
      <div
        class="modal-dialog"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">How are you using this?</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <button
              type="button"
              class="btn btn-info btn-block mb-3"
              @click="onClickUseOnce"
            >Just once</button>
            <button
              type="button"
              class="btn btn-info btn-block"
              @click="onClickUseOngoing"
            >Ongoing</button>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >Cancel</button>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import { mapState } from 'vuex';
import DateTable from '../components/DateTable';
import jQuery from 'jquery';
let $ = jQuery;
import Chart from '../components/Chart';

export default {

  components: { DateTable, Chart },

  data() {
    return {
      thing: null,
      showModal: false,
      inputName: '',
      isNameTaken: false,
    };
  },

  created() {
    this.thing = this.$store.getters['things/id'](this.$route.params.id);

    this.$store.watch(() => {
      this.thing = this.$store.getters['things/id'](this.$route.params.id);
    });
  },

  computed: {
    ...mapState('ratings', {
      ratings: 'all'
    }),

    latestDate() {
      if (!this.thing.dates || this.thing.dates.length == 0) {
        return null;
      }
      let date = this.thing.dates.slice()
        .sort((a, b) => {
          let x = a.end || a.date;
          let y = b.end || b.date;
          return new Date(x) - new Date(y);
        })
        .pop();
      return date.end || date.date;
    },

    earliestDate() {
      if (!this.thing.dates || this.thing.dates.length == 0) {
        return null;
      }
      let date = this.thing.dates.slice()
        .sort((a, b) => {
          let x = a.end || a.date;
          let y = b.end || b.date;
          return new Date(y) - new Date(x);
        })
        .pop();
      return date.start || date.date;
    },

    xmin() {
      if (!this.earliestDate) return null;

      let date = new Date(this.earliestDate);
      date.setDate(date.getDate() - 1);
      return date;
    },

    xmax() {
      if (!this.latestDate) return null;
      
      let date = new Date(this.latestDate);
      date.setDate(date.getDate() + 1);
      return date;
    },

    chartData() {
      let data = {
        type: "spline",
        xs: {},
        columns: []
      };

      let dates = {};
      let ratings = {};

      this.ratings.forEach(rating => {
        let t = rating.tracker;
        if (!dates[t]) {
          dates[t] = [];
        }
        if (!ratings[t]) {
          ratings[t] = [];
        }

        dates[t].push(rating.date);
        ratings[t].push(rating.rating);
      });

      for (let series in dates) {
        data.xs[series] = 'x' + series;
        data.columns.push([series, ...ratings[series]]);
        data.columns.push(['x' + series, ...dates[series]]);
      }

      return data;
    },

    chartRegions() {
      return [{ thing: this.thing, color: 'region-color--0' }];
    },

  },

  methods: {

    async save(forward = true) {
      try {
        this.loading = true;
        await this.$store.dispatch('things/save', this.thing, { root: true });
        this.loading = false;
        if (forward)
          this.$router.push('/kitty');
      } catch (e) {
        this.loading = false;
        this.error = e;
      }
    },

    stop() {
      this.thing.dates.push({
        start: this.thing.since,
        end: new Date().toISOString()
      });
      this.thing.since = null;
      //need to wait before re-render or click gets fired on new button
      window.setTimeout(() => {
        this.thing.active = false;
        this.save(false);
      }, 10);
    },

    async delete() {
      try {
        this.loading = true;
        await this.$store.dispatch('things/delete', this.thing, { root: true });
        this.loading = false;
        this.$router.push("/");
      } catch (e) {
        this.loading = false;
        this.error = e;
      }
    },

    setDates(dates) {
      this.thing.dates = dates;
      this.save(false);
    },

    onClickDelete() {
      if (confirm("Are you sure?")) {
        this.delete();
      }
    },

    onSubmitName() {

      let t = this.$store.getters['things/name'](this.inputName);
      if (t) {
        this.isNameTaken = true;
        return;
      } 
      
      this.isNameTaken = false;
      $("#modal-name").modal("hide");

      if (this.inputName.length == 0) return;

      this.thing.name = this.inputName;
      this.inputName = "";
      this.save(false);
    },

    onClickUseOnce() {
      $("#modal-start").modal("hide");
      this.thing.dates.push({date: new Date()});
      this.save(false);
    },

    onClickUseOngoing() {
      $("#modal-start").modal("hide");
      this.thing.since = new Date();
      this.thing.active = true;
      this.save(false);
    }
  }
};
</script>