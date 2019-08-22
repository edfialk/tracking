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
            <input type="password" class="form-control" id="password" v-model="password" required @keyup="error = ''">
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-lg btn-success">Sign In</button>
          </div>
        </form>
      </div>

      <footer class="bg-danger" v-if="error">
        <div class="inner text-light p-3">
          {{ error }}
        </div>
      </footer>

    </div>
</template>

<script>

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
    login() {
      this.$store.dispatch('login', { email: this.email, password: this.password }).then(() => {
        this.error = '';
        this.$router.push('/');
      }).catch(error => {
        this.error = error.message;
      });
    }
  }
}
</script>
