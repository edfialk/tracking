<template>
  <main id="app" class="">
    <transition
      :name="transitionName"
      mode="out-in"
    >
      <router-view />
    </transition>
    <Nav :page="page"></Nav>
  </main>
</template>

<script>

import Nav from './components/Nav';

export default {

  components: { Nav },

  data() {
    return {
      transitionName: 'fade',
      page: 'home',
    }
  },

  created() {
    this.$store.dispatch('getUserData');
    this.$store.dispatch('things/get');
    this.$store.dispatch('ratings/get');

    this.$router.beforeEach((to, from, next) => {
      if (to.path !== '/') {
        this.transitionName = 'slide-left';
      } else {
        this.transitionName = 'slide-right';
      }

      this.page = to.name;

      console.log(to);

      next();
    })

  },

}

</script>