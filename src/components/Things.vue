<template>

  <div class="py-3 things">
    <div v-if="active.length > 0">
      <h6>Using</h6>
      <p class="text-muted small float-right">Click to highlight</p>
      <div class="block" v-for="(thing, i) in active" :key="i">
        {{ thing.name }}
      </div>
    </div>

    <div v-if="inactive.length > 0">
      <div class="flex">
        <h5 class="text-left mb-0">Not Using</h5>
        <p class="text-muted small text-right mb-0">Click name to highlight</p>
      </div>
      <div class="block flex bg-white" v-for="(thing, i) in inactive" :key="i">
        <div class="flex-grow-1" @click="toggleThing(thing.name)">
          <span class="title">{{ thing.name }}</span>
          <p class="small mb-0">Last used {{ lastUsed(thing) }}</p>
        </div>
        <div class="color" :class="style(thing.name)"></div>
        <div class="forward">
          <router-link :to="'/thing/' + thing">
            <span class="oi oi-chevron-right text-muted lead"></span>
          </router-link>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import { mapState, mapGetters } from 'vuex';

export default {
	
	data() {
		return {
      colorIndex: 0,
      colors: {},
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
      return 'date';
    },

    style(name) {
      if (this.colors[name]) return this.colors[name];
      return "";
    }
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

