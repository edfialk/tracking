<template>
    
    <div class="container bg-light pt-3 h-100">
        
        <div class="flex flex-column mb-3">
            <h4 class="text-center">Take a photo for:</h4>
            <select name="tracker" id="tracker" class="bg-light border-top-0 border-left-0 border-right-0 h4" v-model="tracker">
                <option v-for="tracker in trackers" :key="tracker" :value="tracker">{{ tracker }}</option>
            </select>
        </div>
        <div>
            <div class="text-center" :class="{ 'my-5' : !hasImage, 'my-3' : hasImage }" v-if="!hasImage">
                <input type="file" name="photo" id="photo" accept="image/*" @change="capture" />
                <label for="photo">
                    <span class="oi oi-camera-slr h1 border rounded px-5 py-4 text-white bg-primary shadow"></span>
                </label>
            </div>
            <div ref="imageDiv" class="imgDiv shadow mb-3"></div>
            <div class="d-flex" v-if="hasImage">
                <button type="btn" class="btn btn-success mx-2 flex-grow-1" :class="{ disabled: loading }" @click="save">Save</button>
                <button type="btn" class="btn btn-info mx-2 flex-grow-1" @click="discard">Discard</button>
            </div>
        </div>
        <div class="mt-5" v-if="all">
            <Gallery :photos="all[tracker]"></Gallery>
        </div>

    </div>
    
</template>

<script>

import { mapState, mapActions } from 'vuex';
import Gallery from '../components/Gallery';
import loadImage from 'blueimp-load-image';
import 'blueimp-load-image/js/load-image-exif';
import 'blueimp-canvas-to-blob';

export default {

    components: { Gallery },

    data() {
        return {
            tracker: '',
            image: null,
            hasImage: false,
            loading: false,
        }
    },

    created() {
        if (this.trackers && this.trackers.length > 0) this.tracker = this.trackers[0];
    },

    watch: {
        trackers(val) {
            if (!this.tracker && val && val.length > 0) this.tracker = val[0];
        }
    },

    computed: {
        trackers() {
            return this.$store.getters['ratings/trackers']();
        },

        ...mapState('photos', ['all']),
    },

    methods: {
        ...mapActions('photos', ['add']),

        capture(e) {
            loadImage(
                e.target.files[0],
                img => {
                    this.$refs.imageDiv.appendChild(img);
                    this.hasImage = true;
                    img.toBlob(blob => this.image = blob );
                }, {
                    orientation: true
                }
            );
        },

        async save() {
            this.loading = true;
            await this.add({ tracker: this.tracker , blob: this.image });
            this.loading = false;
            this.discard();

        },

        discard() {
            this.$refs.imageDiv.innerHTML = '';
            this.image = null;
            this.hasImage = false;
        }
    }
}

</script>

<style lang="scss" scoped>
#photo {
    width: 0.1px; //keeps ability to tab
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: 01;
}
</style>