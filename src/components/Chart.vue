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
      type: Array
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
      }
    };
  },

  mounted() {
    this.options.data = this.chartData;

    // if (!this.hasData) {
    //   return;
    // }

    this.chart = c3.generate(this.options);

    window.chart = this.chart;


    /*
    if (this.xmin && this.xmax) {
      window.setTimeout(() => {
        this.chart.zoom([this.xmin, this.xmax]);
      }, 0);

      // window.setTimeout(() => {
      //   this.chart.zoom([new Date('May 23 2019'), new Date('June 12 2019')]);
      // }, 10);
    }
    */


    if (this.regions) {
      this.chart.regions(this.chartRegions.regions);
      this.chart.xgrids(this.chartRegions.lines);
    }
  },

  watch: {
    regions() {
      this.chart.regions(this.chartRegions.regions);
      this.chart.xgrids(this.chartRegions.lines);
    },

    chartData(val) {
      if (!this.chart) this.chart = c3.generate(this.options);

      this.chart.load(val);

      // if (this.xmin && this.xmax) {
      //   this.chart.zoom([this.xmin, this.xmax]);
      // }
    },

    xmin(val) {
      // if (val && this.xmax) this.chart.zoom([val, this.xmax]);
    },

    xmax(val) {
      // if (val && this.xmin) this.chart.zoom([this.xmin, val]);
    }
  },

  computed: {
    chartRegions() {
      return this.regions.reduce(
        (acc, cur) => {
          if (cur.thing.since) {
            acc.regions.push({
              axis: "x",
              start: new Date(cur.thing.since),
              class: cur.color
            });
            /* for adding line with text at beginning of regions */
            // acc.lines.push({
            //   value: new Date(cur.thing.since), class: cur.color, text: cur.thing.name
            // });
          }

          if (cur.thing.dates && cur.thing.dates.length) {
            cur.thing.dates.forEach(d => {
              if (d.date) {
                acc.lines.push({
                  value: new Date(d.date),
                  class: cur.color,
                  text: cur.thing.name
                });
              } else {
                acc.regions.push({
                  axis: "x",
                  start: new Date(d.start),
                  end: new Date(d.end),
                  class: cur.color
                });
                /* for adding line with text at beginning of regions */
                // acc.lines.push({
                //   value: new Date(d.start), class: cur.color, text: cur.thing.name
                // });
              }
            });
          }

          return acc;
        },
        { lines: [], regions: [] }
      );
    },

    hasData() {
      return this.chartData.columns && this.chartData.columns.length > 0;
    },

    colors() {
      return this.chart ? this.chart.data.colors() : null;
    }
  }
};
</script>


