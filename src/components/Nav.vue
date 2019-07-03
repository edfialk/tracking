<template>

    <nav class="navbar navbar-light mb-2">
        <a class="navbar-brand" href="#" @click.prevent="$router.go(-1)" v-if="notHome">
            <span class="oi oi-chevron-left text-gray" title="back" aria-hidden="true"></span>
        </a>
    </nav>


</template>

<script>

export default {
    computed: {
        notHome() {
            return this.$route.path !== '/';
        }
    }
}

</script>

<style>

.navbar-light {
    background-color: #e3f2fd;
    height: 56px;
}

</style>