<template>
  <div class="bg-light p-1 rounded mb-3">
		<div id="chart"></div>
  </div>
</template>

<script>

import c3 from 'c3';

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

  data: function() {
    return {
      myRegions: [],
    };
  },

	mounted() {

    let axis = {
      x: {
        type: 'timeseries',
        tick: { 
          count: 6,
          format: '%m-%d'
        }
      }
    };

    let zoom = {
      enabled: true,
      // onzoom (domain) {}
    };

		this.chart = c3.generate({
        bindto: '#chart',
        data: this.chartData,
        axis,
        zoom
        // subchart: {
        //   show: true
        // }
    });
    
    if (this.xmin && this.xmax) {
      window.setTimeout(() => {
        this.chart.zoom([this.xmin, this.xmax]);
      }, 0);

      // window.setTimeout(() => {
      //   this.chart.zoom([new Date('May 23 2019'), new Date('June 12 2019')]);
      // }, 10);
    }

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
      this.chart.load(val);
    }
  },

  computed: {
    chartRegions() {
      return this.regions.reduce((acc, cur) => {

        if (cur.thing.since) {
          acc.regions.push({
            axis: 'x', start: new Date(cur.thing.since), class: cur.color
          });
          /* for adding line with text at beginning of regions */
          // acc.lines.push({
          //   value: new Date(cur.thing.since), class: cur.color, text: cur.thing.name
          // });
        }

        if (cur.thing.dates && cur.thing.dates.length){
          cur.thing.dates.forEach(d => {

            if (d.date){
              acc.lines.push({
                value: new Date(d.date), class: cur.color, text: cur.thing.name
              });
            } else {
              acc.regions.push({
                axis: 'x', start: new Date(d.start), end: new Date(d.end), class: cur.color
              });
              /* for adding line with text at beginning of regions */
              // acc.lines.push({
              //   value: new Date(d.start), class: cur.color, text: cur.thing.name
              // });
            }

          });

        }
        
        return acc;

      }, { lines: [], regions: [] });
    }
  }
};
</script>


