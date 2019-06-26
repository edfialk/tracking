<template>
  <div
    class="mb-3 bg-light rounded shadow text-center"
    v-if="dates && dates.length > 0"
  >

    <!-- <table class="table border-bottom">
      <tbody>
        <tr
          v-for="(range, i) in dates"
          :key="i"
        >
          <td
            colspan="2"
            v-if="range.date"
            @click="onClickSingleDate(range, i)"
          >{{ range.date | date }}</td>
          <td
            v-if="range.start"
            @click="onClickStartDate(range, i)"
          >{{ range.start | date }}</td>
          <td
            v-if="range.end"
            @click="onClickEndDate(range, i)"
          >{{ range.end | date }}</td>
        </tr>
      </tbody>
    </table> -->

    <div class="card text-center">
      <div class="card-header">
        Use Dates
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item" v-for="(range, i) in dates" :key="i">
          {{ displayRange(range) }}
        </li>
      </ul>
    </div>

    <datetime
      input-class="d-none"
      ref="datepicker"
      v-model="datePickerOptions.date"
      value-zone="America/Los_Angeles"
      @input="onDatePickerInput"
      :min-datetime="datePickerOptions.min"
      :max-datetime="datePickerOptions.max"
    ></datetime>

  </div>

</template>

<script>

export default {

	props: {
    dates: {
      type: Array
    }
  },

  data() {
    return {
      datePickerOptions: {},
    }
  },

  methods: {

    onClickStartDate(range, index) {
      this.datePickerOptions = {
        date: range.start,
        min: null,
        max: range.end,
        index,
        prop: 'start'
      };
      this.openDatePicker();
    },

    onClickEndDate(range, index) {
      this.datePickerOptions = {
        date: range.end,
        min: range.start,
        max: null,
        index,
        prop: 'end'
      };
      this.openDatePicker();
    },

    onClickSingleDate(range, index) {
      this.datePickerOptions = {
        date: range.date,
        min: null,
        max: null,
        index,
        prop: 'date'
      };
      this.openDatePicker();
    },

    openDatePicker() {
      this.$refs["datepicker"].$el.querySelector(".vdatetime-input").click();
    },

    onDatePickerInput(e) {
      if (!e) return;

      let i = this.datePickerOptions.index;
      let prop = this.datePickerOptions.prop;

      this.dates[i][prop] = this.datePickerOptions.date;

      this.save();
    },

    save() {
      this.$emit('save', this.dates);
    },

    displayRange(range) {
      if (range.date){
        return new Date(range.date).toLocaleDateString();
      }

      if (range.start && range.end) {
        return new Date(range.start).toLocaleDateString() + ' - ' + new Date(range.end).toLocaleDateString();
      }

      return "You shouldn't be seeing this.";
    }

  }

}


</script>