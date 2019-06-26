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
      Chart with this thing highlighted will go here.
    </div>

    <DateTable
      :dates="thing.dates"
      @save="setDates"
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
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="onSubmitName"
            >Save</button>
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
import DateTable from "../components/DateTable";
import jQuery from "jquery";
let $ = jQuery;

export default {
  props: {
    id: {
      type: String
    },
    things: {
      type: Array
    }
  },

  components: { DateTable },

  data() {
    return {
      thing: null,
      showModal: false,
      inputName: ""
    };
  },

  created() {
    this.thing = this.things.find(e => e.id === this.id);
  },

  watch: {
    things: {
      handler(val) {
        this.thing = val.find(e => e.id === this.id);
      }
    }
  },

  computed: {
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
    }
  },

  methods: {
    save() {
      this.$emit("saveThing", this.thing);
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
        this.save();
      }, 10);
    },

    delete() {
      this.$emit("deleteThing", this.thing);
    },

    setDates(dates) {
      this.thing.dates = dates;
      this.save();
    },

    onClickDelete() {
      if (confirm("Are you sure?")) {
        this.delete();
        this.$router.push("/");
      }
    },

    onSubmitName() {
      $("#modal-name").modal("hide");
      if (this.inputName.length == 0) return;
      this.thing.name = this.inputName;
      this.inputName = "";
      this.save();
    },

    onClickUseOnce() {
      $("#modal-start").modal("hide");
      this.thing.dates.push({date: new Date().toISOString()});
      this.save();
    },

    onClickUseOngoing() {
      $("#modal-start").modal("hide");
      this.thing.since = new Date().toISOString();
      this.thing.active = true;
      this.save();
    }
  }
};
</script>