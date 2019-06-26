<template>
  <div class="bg-light p-1 rounded">
    <apexchart
      type="area"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>

export default {

	props: {
		chartData: {
			type: Array
		},
		annotations: {
			type: Array
		}
	},

  data: function() {
    return {
      chartOptions: {
				line: {
					curve: 'smooth'
				},
        xaxis: {
					type: 'datetime',
        },
        yaxis: {
          show: false
				},
        markers: {
          size: 0,
          style: 'full',
				},
				dataLabels: {
					enabled: false
				},
				chart: {
					toolbar: {
						show: true,
						tools: {
							pan: true,
							download: false,
							zoomin: true,
							zoomout: true,
						},
						autoSelected: 'pan'
					}
				},
				tooltip: {
					custom: ({series, seriesIndex, dataPointIndex, /* w */}) => {
						return '<div class="p-2">Rating: ' + series[seriesIndex][dataPointIndex] + '</div>'
					}
				}
			},
    };
	},
	
  methods: {

		getAnnotations(thing, color) {

			let r = [];

			if (thing.dates && thing.dates.length > 0){
				r = thing.dates.map(date => {
					return this.getAnnotationObject(thing.name, date.start.toMillis(), date.end.toMillis(), color);
				});
			}

			if (thing.since){
				r.push(this.getAnnotationObject(thing.name, thing.since.toMillis(), new Date().getTime(), color));
			}
			
			return r;

		},

		getAnnotationObject(text, start, end, color) {

			return {
				x: start,
				x2: end,
				borderColor: color,
				fillColor: color,
				opacity: 0.5,
				label: {
					style: {
						fontSize: '12px',
						color: '#fff',
						background: '#333',
					},
					text,
				}
			};

		},

		generateDayWiseTimeSeries: function (baseval, count, yrange) {
			var i = 0;
			var series = [];
			while (i < count) {
				var x = baseval;
				var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

				series.push([x, y]);
				baseval += 86400000;
				i++;
			}

			this.series = [{ data: series }];
		}

	},
	
	watch: {
		annotations(val){
			let options = Object.assign({}, this.chartOptions);

			options.annotations = {
				xaxis: val.reduce(
					(acc, cur) => {
						return acc.concat(this.getAnnotations(cur.thing, cur.color));
					}, []
				)
			};

			this.chartOptions = options;

		},
	},

	computed: {
		series() {
			return [{
				data: this.chartData
			}]
		}
	}
};

</script>


