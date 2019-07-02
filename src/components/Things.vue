<template>

  <div class="box mb-3 box border rounded bg-light">
    <div class="p-3 text-center">
      <h5 class="mb-0">Active Things</h5>
    </div>
    <table class="table table-last-col-right">
      <tbody>
        <tr
          v-for="thing in $store.getters['things/active']"
          v-bind:key="thing.id"
        >
          <td @click="onRowClick(thing, $event)">{{ thing.name }}</td>
          <td>
            <router-link :to="'/thing/' + thing.id">
              <span class="oi oi-chevron-right text-muted"></span>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="p-3 text-center">
      <h5 class="mb-0">Inactive Things</h5>
    </div>
    <table class="table table-last-col-right">
      <tbody>
        <tr
          v-for="thing in $store.getters['things/inactive']"
          v-bind:key="thing.id"
        >
          <td @click="onClickThing(thing, $event)">{{ thing.name }}</td>
          <td>
            <router-link :to="'/thing/' + thing.id">
              <span class="oi oi-chevron-right text-muted"></span>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>

import { mapState } from 'vuex';

export default {
	
	data() {
		return {
      selected: []
		};
	},

  methods: {
    onClickThing(thing, event) {
			let tr = event.target.parentElement;
      let color;

      if (!tr.classList.contains('active')){
        color = this.getNextColorClass();
        tr.classList.add('active', color);
        this.selected.push({ tr, thing, color });
      } else {
        let t = this.selected.find(e => e.thing.name === thing.name);
        tr.classList.remove('active', t.color);
        this.selected = this.selected.filter(e => e.thing.name !== thing.name);
      }

      this.$emit('toggleThing', thing, color);
    },

    getNextColorClass() {
      return 'region-color--' + this.selected.length;
    }
  },

  computed: {

    ...mapState({
      things: state => state.things.all,
    }),
    
  }
};
</script>

