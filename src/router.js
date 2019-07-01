import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
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
      path: '/rate/',
      name: 'rate',
      component: () => import(/* webpackChunkName: "rate" */ './views/Rate.vue')
    },
    {
      path: '/kitty',
      name: 'kitty',
      component: () => import(/* webpackChunkName: "kitty" */ './views/Kitty.vue')
    },
    {
      path: '/tracker/add',
      name: 'add-tracker',
      component: () => import(/* webpackChunkName: "tracker" */ './views/AddTracker.vue')
    }
  ]
})
