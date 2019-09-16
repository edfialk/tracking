<template>

  <div class="container bg-grey pt-3">

    <div v-if="thing">

      <div class="p-3 mb-3 bg-light rounded shadow text-center">
        <h5 class="mb-0">
          <span v-if="thing.since">You have been using {{ thing.name }} for {{ thing.since | ago(true) }}.</span>
          <span v-else>You last used {{ thing.name }} {{ latestDate | ago }}</span>
        </h5>
      </div>

      <div class="mb-3 datetime-header__show" ref="stopDatetime">
        <button
          v-if="!thing.since"
          type="btn"
          class="btn btn-info btn-block shadow"
          data-toggle="modal"
          data-target="#modal-start"
        >Use {{ thing.name }}</button>
        <button
          v-if="thing.since"
          type="btn"
          class="btn btn-info btn-block"
          @mouseup="stop"
        >Stop using {{ thing.name }}</button>
        <datetime
          :bootstrap-styling="true"
          input-class="d-none"
          v-model="use.date"
          value-zone="America/Los_Angeles"
          format="DDDD"
          title="When did you stop?"
          @input="onStopDatePicked"
        ></datetime>
      </div>

      <div class="mb-3 p-3 bg-light rounded shadow text-center">
        <Chart :chartData="chartData" :regions="chartRegions"></Chart>
      </div>

      <div class="mb-3">
        <button
          type="btn"
          class="btn btn-info btn-block"
          data-toggle="modal"
          data-target="#modal-name"
        >Rename {{ thing.name }}</button>
        <button
          type="btn"
          class="btn btn-secondary btn-block"
          @click="onClickDelete"
        >Stop tracking {{ thing.name }}</button>
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
            <div class="modal-body datetime-header__show" ref="startDatetime">
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
              <datetime
                :bootstrap-styling="true"
                input-class="d-none"
                v-model="use.date"
                value-zone="America/Los_Angeles"
                format="DDDD"
                :title="use.status == 'choseOnce' ? 'When did you use it?' : 'When did you start?'"
                @input="onStartDatePicked"
              ></datetime>
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

    <div class="p-3 bg-light rounded shadow h-100" v-if="loadStatus=='success' && !thing">
      You don't have anything with that name. There might be a problem.
      <a href="#" @click.prevent="$router.go(-1)">
        You should go back.
      </a>  
    </div>

  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex';
// import DateTable from '../components/DateTable';
import jQuery from 'jquery';
let $ = jQuery;
import Chart from '../components/Chart';

export default {

  components: { Chart },

  data() {
    return {
      showModal: false,
      inputName: '',
      isNameTaken: false,
      notFound: false,
      use: {
        once: false,
        date: null,
        status: 'choosing'
      }
    };
  },

  computed: {

    ...mapState('things', {
      loadStatus: 'status'
    }),

    ...mapGetters('ratings', {
      ratings: 'get'
    }),

    thing() {
      return this.$store.getters['things/name'](this.$route.params.id);
    },

    latestDate() {
      if (!this.thing.dates || this.thing.dates.length == 0) {
        return null;
      }
      let date = this.thing.dates.slice()
        .sort((a, b) => {
          let x = a.end || a.date;
          let y = b.end || b.date;
          return x - y;
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
          return y - x;
        })
        .pop();
      return date.start || date.date;
    },

    chartData() {

      let data = {
        type: "spline",
        xs: {},
        columns: []
      };

      if (!this.ratings) return data;

      let dates = {};
      let ratings = {};

      for (let tracker in this.ratings) {
        dates[tracker] = dates[tracker] || [];
        ratings[tracker] = ratings[tracker] || [];

        this.ratings[tracker].forEach(rating => {
          dates[tracker].push(rating.date);
          ratings[tracker].push(rating.value);
        });

        data.xs[tracker] = 'x' + tracker;
        data.columns.push(['x' + tracker, ...dates[tracker]]);
        data.columns.push([tracker, ...ratings[tracker]]);
      }

      return data;
    },

    chartRegions() {
      let o = {};
      o[this.thing.name] = {
        thing: this.thing,
        color: 'region-color--3'
      };
      return o;
    },

  },

  methods: {

    async save() {
      try {
        this.loading = true;
        await this.$store.dispatch('things/save', this.thing);
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.error = e;
      }
    },

    async delete() {
      try {
        this.loading = true;
        await this.$store.dispatch('things/delete', this.thing.name);
        this.loading = false;
        this.$router.push("/");
      } catch (e) {
        this.loading = false;
        this.error = e;
      }
    },

    onClickDelete() {
      if (confirm("Are you sure?")) {
        this.delete();
      }
    },

    onSubmitName() {
      let newName = this.inputName;
      let t = this.$store.getters['things/name'](newName);
      if (t) {
        this.isNameTaken = true;
        return;
      } 
      
      this.isNameTaken = false;
      $("#modal-name").modal("hide");

      if (this.inputName.length == 0) return;

      const oldName = this.thing.name;
      const thing = {...this.thing, name: newName };

      this.$store.dispatch('things/add', thing);
      this.$router.replace('/thing/' + newName);
      this.$store.dispatch('things/delete', oldName);
      this.inputName = "";
    },

    onClickUseOnce() {
      this.use.once = true;
      this.use.status = "choseOnce";
      this.$refs.startDatetime.querySelector('input').click();
    },

    onClickUseOngoing() {
      this.use.once = false;
      this.use.status = "choseOngoing";
      this.$refs.startDatetime.querySelector('input').click();
    },

    onStartDatePicked() {
      if (!this.use.date) return;
      $('#modal-start').modal('hide');

      const name = this.thing.name;
      const date = new Date(this.use.date);

      if (this.use.once) {
        this.$store.commit('things/useOnce', { name, date });
      } else {
        this.$store.commit('things/useOngoing', { name, date });
      }

      this.save();
      this.use.status = "choosing";
      this.use.date = null;
    },

    stop() {
      this.$refs.stopDatetime.querySelector('input').click();
    },

    onStopDatePicked() {
      if (!this.use.date) return;
      const date = new Date(this.use.date);
      this.$store.commit('things/stop', { name: this.thing.name, date });
      this.save();
      this.use.date = null;
    }


  }
};
</script>