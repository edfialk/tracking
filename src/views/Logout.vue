<template>
    <div class="container flex">
        <h5 v-if="error">{{ error }}</h5>
    </div>
</template>

<script>

export default {
    data() {
        return {
            error: ''
        }
    },

    created() {
        this.$store.dispatch('logout').then(() => {
            this.$router.push('/');
        }).catch(error => {
            this.error = error;
        });
    }
}

</script>