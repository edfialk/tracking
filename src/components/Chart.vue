<template>
  <div class="bg-light p-2 text-center">
    <h5
      class="my-5"
      v-if="!hasData"
    >Add data to see this chart.</h5>
    <div id="chart"></div>
    <div class="legend pb-2">
      <span
        v-for="(color, series) in colors"
        :key="series"
        :style="'background-color:' + color"
        class="text-white py-1 px-2 rounded-pill small"
      >
        {{ series }}
      </span>
    </div>
  </div>
</template>

<script>
import c3 from "c3";

export default {
  props: {
    chartData: {
      type: Object
    },
    regions: {
      type: Object
    },
    xmin: {
      type: Date
    },
    xmax: {
      type: Date
    }
  },

  data() {
    return {
      chart: null,
      options: {
        bindto: "#chart",
        size: {
          height: 150
        },
        data: {},
        axis: {
          x: {
            type: "timeseries",
            tick: {
              count: 8,
              format: "%a", //'%m-%d'
              fit: true
            },
            min: this.xmin,
            max: this.xmax
          },
          y: {
            show: false,
            max: 9,
            min: 1
          }
        },
        zoom: {
          enabled: true
        },
        tooltip: {
          format: {
            title(date) {
              return date.getMonth() + 1 + "/" + date.getDate();
            }
          }
        },
        grid: {
          x: {
            show: false
          }
        },
        legend: {
          show: false
        }
      },
    };
  },

  mounted() {
    this.options.data = this.chartData;

    // if (!this.hasData) {
    //   return;
    // }

    this.chart = c3.generate(this.options);

    window.chart = this.chart;

    if (this.xmin && this.xmax) {
      window.setTimeout(() => {
        this.chart.zoom([this.xmin, this.xmax]);
      }, 0);
    }

  },

  watch: {
    regions(val) {
      if (!this.chart) return;

      let r = [];
      for (let i in val) {
        const thing = val[i].thing;
        if (!thing.dates || thing.dates.length == 0) continue;
        r = r.concat(thing.dates.map(date => {
          return {
            axis: 'x',
            start: date.start,
            end: date.end,
            class: val[i].color
          };
        }));
      }

      this.chart.regions(r);

    },

    chartData(val) {
      if (!this.chart) this.chart = c3.generate(this.options);

      this.chart.load(val);

      // if (this.xmin && this.xmax) {
      //   this.chart.zoom([this.xmin, this.xmax]);
      // }
    },

    xmin(val) {
      if (val && this.xmax) this.chart.zoom([val, this.xmax]);
    },

    // xmax(val) {
    //   if (val && this.xmin) this.chart.zoom([this.xmin, val]);
    // }
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


