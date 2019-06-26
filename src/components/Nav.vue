<template>

    <nav class="navbar navbar-light mb-2">
        <a class="navbar-brand" href="#" @click.prevent="$router.go(-1)">
            <span class="oi oi-chevron-left text-gray" title="back" aria-hidden="true"></span>
        </a>
    </nav>


</template>

<style>

.navbar-light {
    background-color: #e3f2fd;
}

</style>