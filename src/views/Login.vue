<template>
    <div class="container d-flex h-100 p-3 mx-auto flex-column">

      <!-- <h1 class="cover-heading">Hi Lerb.</h1> -->

      <div class="flex-grow-1 d-flex align-items-center">
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" id="email" v-model="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" v-model="password" required>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-lg btn-light">Sign In</button>
          </div>
        </form>
      </div>

      <footer>
        <div class="inner">
          {{ error }}
        </div>
      </footer>

    </div>
</template>

<script>

import * as firebase from 'firebase/app';
import 'firebase/auth';

export default {

  name: 'login',

  data() {
    return {
      email: "",
      password: "",
      error: null
    }
  },

  methods: {
    async login() {
      await firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(error => {
        // var errorCode = error.code;
        this.error = error.message;
      });

      this.$router.push('/');
    }
  }
}
</script>
