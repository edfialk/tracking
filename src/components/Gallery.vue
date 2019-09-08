<template>
    <div class="container">
        <transition-group name="fade" tag="div" class="photo--list">
            <div v-for="photo in photos" class="photo--item" :key="photo.id">
                <img :src="photo.thumbUrl ? photo.thumbUrl : photo.url">
            </div>
        </transition-group>
    </div>
</template>

<script>

export default {
    
    props: {
        photos: Array
    },

    // computed: {
    //     photos() {
    //         let a = [];
    //         for (let i = 0; i < 20; i++) {
    //             a.push({
    //                 id: i,
    //                 thumbUrl: "https://picsum.photos/200/200"
    //             })
    //         }
    //         return a;
    //     }
    // }

}

</script>

<style lang="scss" scoped>
.photo--list {
    @extend .row, .no-gutters;
}
.photo--item {
    @extend .col-6, .mb-2, .px-1;
}
</style>