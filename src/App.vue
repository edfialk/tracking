<template>
  <main id="app" class="bg-light">
    <transition
      :name="transitionName"
      mode="out-in"
    >
      <router-view style="padding-bottom: 80px"/>
    </transition>
    <Nav v-if="signedIn"></Nav>
  </main>
</template>

<script>

import Nav from './components/Nav';

export default {

  components: { Nav },

  data() {
    return {
      transitionName: 'fade',
    }
  },

  created() {
    // this.$store.dispatch('getUserData');
    this.$store.dispatch('things/get');
    this.$store.dispatch('ratings/get');

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
    signedIn() {
      return this.$store.state.user !== null;
    }
  }

}

</script>