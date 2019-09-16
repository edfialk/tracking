<template>
    <div>
        <div class="container">

            <div id="gallery"></div>

            <transition-group name="fade" tag="div" class="photo--list">
                <div v-for="photo in photos" class="photo--item" :key="photo.id">
                    <img :src="photo.thumbUrl ? photo.thumbUrl : photo.url">
                </div>
            </transition-group>
        </div>
        <!-- <div class="overlay text-light">
            <span class="close-icon oi oi-x"></span>
            <img src="https://picsum.photos/1200/600" />
            <div class="controls d-flex justify-content-around p-5">
                <span class="oi oi-chevron-left"></span>
                <span class="oi oi-chevron-right"></span>
            </div>
        </div> -->

    </div>
</template>

<script>
import jQuery from 'jquery';
window.jQuery = jQuery;

export default {
    
    props: {
        photos: Array
    },

    data() {
        return {
            active: null
        }
    },

    mounted() {
        if (this.photos && this.photos.length > 0) {
            this.gallery();
        }
    },

    watch: {
        photos(val) {
            if (val && val.length > 0) this.gallery();
        }
    },

    methods: {
        gallery() {
            // let opts = {
            //     thumbnailHeight: 200,
            //     thumbnailWidth: 200,
            //     items: this.photos.map(p => {
            //         return {
            //             src: p.url,
            //             srct: p.thumbUrl,
            //             title: p.date.toString()
            //         }
            //     })
            // }
            // jQuery(this.$el).find("#gallery").nanogallery2(opts);
        }
    }

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
.overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    font-size: 1.6rem;
    .close-icon {
        position: absolute;
        top: 20px;
        right: 20px;
    }
    img {
        position: relative;
        top: 50%;
        left: 5%;
        max-width: 90%;
        transform: translateY(-50%);
        max-height: 60%;
    }
    .controls {
        position: relative;
        bottom: 50px;
        left: 0;
    }
}
</style>