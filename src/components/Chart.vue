<template>
  <div class="bg-light p-2 text-center">
    <h5
      class="my-5"
      v-if="!hasData"
    >Add data to see this chart.</h5>
    <div class="text-right">
      <select
        v-model="timerange"
        class="transparent small"
      >
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
    </div>
    <div id="chart"></div>
    <div class="legend pb-2">
      <span
        v-for="(color, series) in colors"
        :key="series"
        :style="'background-color:' + color"
        class="text-white py-1 px-2 rounded-pill small mx-1"
      >
        {{ series }}
      </span>
    </div>
  </div>
</template>

<script>
import c3 from "c3";
import * as moment from 'moment';

export default {
  props: {
    chartData: {
      type: Object
    },
    regions: {
      type: Object
    },
  },

  data() {
    return {
      chart: null,
      timerange: "week",
      ranges: {
				week: moment().subtract(1, "week").toDate(),
        month: moment().subtract(1, "month").toDate(),
        year: moment().subtract(1, "year").toDate()
      },
      ticks: {
        week: [],
        month: [],
        year: []
      },
      formats: {
        week: '%a',
        month: '%b %d',
        year: '%b'
      },
      options: {
        bindto: "#chart",
        size: {
          height: 150
        },
        data: {},
        point: {
          show: false
        },
        axis: {
          x: {
            type: "timeseries",
            tick: {
              count: 7,
              format: "%a", //'%m-%d'
              fit: false, //true aligns tick with data
              values: []
            },
          },
          y: {
            show: false,
            max: 9,
            min: 1
          }
        },
        zoom: {
          // enabled: true,
          onzoomend: function(domain) {
            console.log('zoom end ', domain);
          }
        },
        tooltip: {
          format: {
            title(date) {
              return date.getMonth() + 1 + "/" + date.getDate();
            }
          }
        },
        legend: {
          show: false
        },
        regions: [],
      },
    };
  },

  created() {
    for (let i = 0; i < 8; i++){
      this.ticks.week.push(moment().subtract(i, 'days'));
    }
    for (let i = 0; i < 5; i++){
      this.ticks.month.push(moment().subtract(i, 'weeks'));
    }
    for (let i = 0; i < 12; i++){
      this.ticks.year.push(moment().subtract(i, 'months'));
    }

    this.options.axis.x.tick.values = this.ticks.week;
    this.options.axis.x.min = this.ranges.week;
  },

  mounted() {
    this.options.data = this.chartData;

    if (this.regions) {
      this.setRegions(this.regions);
    }

    this.chart = c3.generate(this.options);
    window.chart = this.chart;

  },

  methods: {
    draw() {
      this.chart.internal.loadConfig(this.options);
      this.chart.flush();
    },

    setRegions(regions) {
      let r = [];
      for (let i in regions) {
        const thing = regions[i].thing;
        if (thing.dates && thing.dates.length) {
          r = r.concat(thing.dates.map(date => {
            return {
              axis: 'x',
              start: date.start,
              end: date.end,
              class: regions[i].color
            };
          }));
        }
        if (thing.since) {
          r.push({
            axis: 'x',
            start: thing.since,
            end: new Date(),
            class: regions[i].color
          });
        }
      }

      this.options.regions = r;
    },

    zoom() {
      this.options.axis.x.tick.values = this.ticks[this.timerange];
      this.options.axis.x.tick.format = this.formats[this.timerange];
      this.draw();
      this.chart.zoom([this.ranges[this.timerange], new Date()]);
    },

  },

  watch: {
    regions(val) {
      this.setRegions(val);
      this.draw();
    },

    chartData(val) {
      this.options.data = val;
      this.chart.load(val);
    },

    timerange() {
      this.zoom();
    }
  },

  computed: {
    hasData() {
      return this.chartData.columns && this.chartData.columns.length > 0;
    },

    colors() {
      return this.chart ? this.chart.data.colors() : null;
    }
  }
};
</script>


