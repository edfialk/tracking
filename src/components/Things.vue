<template>

  <div class="box mb-3 box border rounded bg-light">
    <div class="p-3 text-center">
      <h5 class="mb-0">Active Things</h5>
    </div>
    <table class="table table-last-col-right">
      <tbody>
        <tr
          v-for="thing in activeThings"
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
          v-for="thing in inactiveThings"
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
export default {
  props: {
    things: {
      type: Array
    }
	},
	
	data() {
		return {
      selectedThings: []
		};
	},

  methods: {
    onClickThing(thing, event) {
			let tr = event.target.parentElement;
      let color;

      if (!tr.classList.contains('active')){
        color = this.getNextColorClass();
        tr.classList.add('active', color);
        this.selectedThings.push({ tr, thing, color });
      } else {
        let t = this.selectedThings.find(e => e.thing.id === thing.id);
        tr.classList.remove('active', t.color);
        this.selectedThings = this.selectedThings.filter(e => e.thing.id !== thing.id);
      }

      this.$emit('toggleThing', thing, color);
    },

    getNextColorClass() {
      return 'region-color--' + this.selectedThings.length;
    }
  },

  filters: {
    date(value) {
      return value.toLocaleDateString();
    }
  },

  computed: {
    activeThings() {
      return this.things.filter(thing => thing.since);
    },

    inactiveThings() {
      return this.things.filter(thing => !thing.since);
    }
  }
};
</script>

