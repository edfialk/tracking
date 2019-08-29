<template>
  <main id="app" class="bg-light">
    <transition
      :name="transitionName"
      mode="out-in"
    >
      <router-view style="padding-bottom: 80px" />
    </transition>
    <Nav v-if="isLoggedIn"></Nav>
  </main>
</template>

<script>

import Nav from './components/Nav';

import { mapGetters } from 'vuex';

export default {

  components: { Nav },

  data() {
    return {
      transitionName: 'fade',
    }
  },

  created() {

    if (this.isLoggedIn) {
      this.$store.dispatch('things/get');
      this.$store.dispatch('ratings/get');
      this.$store.dispatch('photos/get');
    }

    this.$router.beforeEach((to, from, next) => {
      if (to.path !== '/') {
        this.transitionName = 'slide-left';
      } else {
        this.transitionName = 'slide-right';
      }

      next();
    });

  },

  computed: {
    ...mapGetters(['isLoggedIn'])
  }

}

</script>