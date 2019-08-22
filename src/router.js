import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index.js';
import Home from './views/Home.vue'


Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      // component: () => import(/* webpackChunkName: "logout" */ './views/Logout.vue')
    },
    {
      path: '/thing/add',
      name: 'add-thing',
      component: () => import(/* webpackChunkName: "thing" */ './views/AddThing.vue'),
    },
    {
      path: '/thing/:id',
      name: 'thing',
      component: () => import(/* webpackChunkName: "thing" */ './views/Thing.vue'),
      props: true,
    },
    {
      path: '/rate',
      name: 'rate',
      component: () => import(/* webpackChunkName: "rate" */ './views/Rate.vue')
    },
    {
      path: '/kitty',
      name: 'kitty',
      component: () => import(/* webpackChunkName: "kitty" */ './views/Kitty.vue')
    },
    {
      path: '/trackers',
      name: 'trackers',
      component: () => import(/* webpackChunkName: "trackers" */ './views/Trackers.vue')
    },
    {
      path: '/tracker/add',
      name: 'add-tracker',
      component: () => import(/* webpackChunkName: "tracker" */ './views/AddTracker.vue')
    },
    {
      path: '/things',
      name: 'things',
      component: () => import(/* webpackChunkName: "things" */ './views/Things.vue')
    },
    {
      path: '/photo',
      name: 'photo',
      component: () => import(/* webpackChunkName: "photo" */ './views/Photo.vue')
    },
  ]
})

router.beforeEach(async (to, from, next) => {

  if (to.name == 'logout' && store.getters.isLoggedIn) {
    await store.dispatch('logout');
    return next('/login');
  }

  // if (to.name == 'logout' && !store.getters.isLoggedIn) {
  //   return next('/login');
  // }

  if (!store.getters.isLoggedIn && to.name != 'login') {
    return next('/login');
  } 
  
  if (store.getters.isLoggedIn && to.name == 'login') {
    return next('/');
  }

  next();

});

export default router;