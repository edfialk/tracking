<template>

  <div class="py-3 things">

    <div v-if="Object.keys(all).length > 0">
      <p class="small">Click name to toggle on graph.</p>
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
            <td class="color" :class="selected[thing.name] ? selected[thing.name].color : ''"></td>
            <td class="text-right">
              <router-link :to="'/thing/' + thing.name">
                <span class="oi oi-chevron-right text-muted lead"></span>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="px-3">
      <router-link to="/thing/add">Click here</router-link> to add factors like medicine, goop, etc.
    </div>
  </div>

</template>

<script>

import * as moment from 'moment';
import { mapState } from 'vuex';

export default {
	
	data() {
		return {
      colorIndex: 0,
      selected: {},
      dates: {},
		};
  },
  
  mounted() {
    for (let t in this.all){
      this.toggleThing(t);
    }
  },

  methods: {
    toggleThing(name) {

      if (this.selected[name]){
        this.$delete(this.selected, name);
        return;
      } 

      this.$set(this.selected, name, {
        color: this.getNextColorClass(),
        thing: this.all[name]
      });

      this.colorIndex++;

      if (this.colorIndex > 4)
        this.colorIndex = 0;
    },

    getNextColorClass() {
      return 'region-color--' + this.colorIndex;
    },

    lastUsed(thing) {

      if (this.dates[thing.name])
        return this.dates[thing.name];

      let res;
      if (thing.since) {
        res = 'today';
      } else if (!thing.dates || thing.dates.length == 0) {
        res = 'never';
      } else {
        res = thing.dates.reduce((acc, cur) => {
          let d = cur.end || cur.date;
          if (d && d > acc){
            return d;
          }
          return acc;
        }, thing.dates[0].end ? thing.dates[0].end : thing.dates[0].date);
        res = moment(res).fromNow();
      }

      this.dates[thing.name] = res;
      return res;

    },

  },

  computed: {

    ...mapState('things', ['all']),

  },

  watch: {
    selected(val) {
      this.$emit('setRegions', val);
    },

    all(val) {
      if (!val) return;
      for (let t in val) {
        if (Object.keys(this.selected).length < 5)
          this.toggleThing(t);
      }
    }
  }
};
</script>

