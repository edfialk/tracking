<template>
  <main id="app" class="w-100 h-100">
    <Nav></Nav>
    <router-view />
  </main>
</template>

<script>

import Nav from './components/Nav';

export default {

  components: { Nav },

  created() {
    this.$store.dispatch('things/get');
    this.$store.dispatch('ratings/get');
  },
}

</script>