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
    }
  },

  data: function() {
    return {
      myRegions: [],
    };
  },

	mounted() {

    let data = {
      type: 'spline',
      x: 'date',
      columns: []
    };

    if (this.chartData.columns[0].length > 1){
      data.columns = this.chartData.columns;
    }

		this.chart = c3.generate({
        bindto: '#chart',
        data,
        axis: {
					x: {
						type: 'timeseries',
						tick: { 
              count: 6,
              format: '%m-%d'
            }
					}
        },
        zoom: {
          enabled: true
        },
        // subchart: {
        //   show: true
        // }
		});
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


