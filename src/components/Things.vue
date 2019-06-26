<template>

  <div class="box my-5 box border rounded bg-light">
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
          @click="onRowClick(thing, $event)"
        >
          <td>{{ thing.name }}</td>
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
			colors: [
				'#E7717D', '#C2CAD0', '#C2B9B0', '#7E685A', '#AFD275'
			],
		};
	},

  methods: {
    onRowClick(thing, $event) {
			let color;
			let tr = $event.target.parentElement;
			tr.classList.toggle('active');


			if (tr.classList.contains('active')){
				let colorIndex = Math.floor(Math.random() * this.colors.length);
				color = this.colors[colorIndex];
				this.colors.splice(colorIndex, 1);
				tr.style.backgroundColor = color;
			}else{
				color = tr.style.backgroundColor;
				tr.style.backgroundColor = "inherit";
				this.colors.push(color);
			}
			
			this.$emit("toggleThing", thing, color);
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

<style scoped>
tr.active {
	background-color: rgb(100,161,204);
}
</style>