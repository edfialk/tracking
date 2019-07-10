<template>
  <main id="app" class="">
    <Nav></Nav>
      <transition
        :name="transitionName"
        mode="out-in"
      >
        <router-view />
      </transition>
  </main>
</template>

<script>

import Nav from './components/Nav';

export default {

  components: { Nav },

  data() {
    return {
      transitionName: 'fade'
    }
  },

  created() {
    this.$store.dispatch('things/get');
    // this.$store.dispatch('ratings/get');
    this.$store.dispatch('trackers/get');

    console.log(this.$store.getters['ratings/getNextDoc']('adorableness'));

    this.$router.beforeEach((to, from, next) => {
      if (to.path !== '/') {
        this.transitionName = 'slide-left';
      } else {
        this.transitionName = 'slide-right';
      }

      next();
    })

  },

}

</script>