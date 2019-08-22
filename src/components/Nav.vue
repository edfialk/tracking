<template>

    <nav class="nav">
        <div class="nav--inner">
            <router-link :to="action" class="raised">
                <span class="oi oi-plus"></span>
            </router-link>
            <router-link to="/" exact class="oi oi-home"></router-link>
            <router-link to="/things" class="oi oi-list"></router-link>
            <div></div>
            <router-link to="/trackers" class="oi oi-graph"></router-link>
            <router-link to="/photo" class="oi oi-camera-slr"></router-link>
        </div>
    </nav>

</template>


<script>

export default {
    computed: {
        action() {
            switch (this.$route.name) {
                case 'thing':
                case 'things':
                case 'add-thing':
                    return '/thing/add';
                case 'trackers':
                case 'add-tracker':
                    return '/tracker/add';
                default:
                    return '/rate';
            }
        }
    }
}

</script>