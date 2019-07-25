<template>

    <nav class="nav">
        <router-link to="/" exact class="oi oi-home"></router-link>
        <router-link to="/things" class="oi oi-list"></router-link>
        <router-link to="/trackers" class="oi oi-graph"></router-link>
        <router-link to="/selfie" class="oi oi-camera-slr"></router-link>
    </nav>


</template>

<script>

export default {

    props: ["page"],

}


</script>
