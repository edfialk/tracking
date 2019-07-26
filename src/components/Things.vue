<template>

  <div class="py-3 things">

    <div class="flex">
      <!-- <h5>Factors</h5> -->
      <p class="font-weight-bold">Factors</p>
      <p class="small">Click name to show on graph.</p>
    </div>
    <table class="table table-sm small">
      <thead>
        <tr>
          <th>Name</th>
          <th class="dropdown-toggle">Used</th>
          <th>Color</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="thing in all" :key="thing.name">
          <td @click="toggleThing(thing.name)">{{ thing.name }}</td>
          <td>{{ lastUsed(thing) }}</td>
          <td class="color" :class="colors[thing.name] || ''"></td>
          <td class="text-right">
            <router-link :to="'/thing/' + thing.name">
              <span class="oi oi-chevron-right text-muted lead"></span>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

  </div>

</template>

<script>

import * as moment from 'moment';
import { mapState, mapGetters } from 'vuex';

export default {
	
	data() {
		return {
      colorIndex: 0,
      colors: {},
      dateCache: {},
		};
  },
  
  methods: {
    toggleThing(name) {

      if (this.colors[name]){
        this.colors[name] = null;
        return;
      } 

      this.$set(this.colors, name, this.getNextColorClass());
      this.colorIndex++;
      if (this.colorIndex > 4) this.colorIndex = 0;

      this.$emit('setRegions', this.colors);
    },

    getNextColorClass() {
      return 'region-color--' + this.colorIndex;
    },

    lastUsed(thing) {

      if (this.dateCache[thing.name])
        return this.dateCache[thing.name];

      let res;
      if (!thing.dates || thing.dates.length == 0) {
        res = '';
      } else if (thing.since) {
        res = 'today';
      } else {
        res = thing.dates.reduce((acc, cur) => {
          if (cur.end && cur.end > acc){
            return cur.end;
          } 
          return acc;
        }, thing.dates[0].end);
        res = moment(res).fromNow();
      }

      this.dateCache[thing.name] = res;
      return res;

    },

  },

  computed: {

    ...mapState('things', {
      all: state => state.all,
    }),

    ...mapGetters('things', [
      'active',
      'inactive'
    ]),

  }
};
</script>

